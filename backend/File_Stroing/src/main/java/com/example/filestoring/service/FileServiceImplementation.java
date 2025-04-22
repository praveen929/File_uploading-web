package com.example.filestoring.service;

import com.example.filestoring.model.FileEntity;
import com.example.filestoring.repository.FileRepository;
import com.example.filestoring.repository.UserRepository;
import com.example.filestoring.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.*;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class FileServiceImplementation implements FileService {

    private static final Path UPLOAD_DIR = Paths.get("uploads");

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private UserRepository userRepository;

    public FileServiceImplementation(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @Override
    public List<FileEntity> searchFiles(String query) {
        // Search by title or firstName/lastName (case-insensitive)
        return fileRepository
                .findByTitleContainingIgnoreCaseOrUser_FirstNameContainingIgnoreCaseOrUser_LastNameContainingIgnoreCase(
                        query, query, query);
    }

    @Override
    public FileEntity uploadFile(Long userId, MultipartFile file, String title, String description) throws Exception {
        Files.createDirectories(UPLOAD_DIR);

        String originalFileName = file.getOriginalFilename();
        String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
        Path filePath = UPLOAD_DIR.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(uniqueFileName)
                .toUriString();

        FileEntity fileEntity = new FileEntity(title, description, uniqueFileName, fileUrl,
                userRepository.findById(userId)
                        .orElseThrow(() -> new Exception("User not found")));

        // Set a custom 8-digit ID for the file
        fileEntity.setId(IdGenerator.generateEightDigitId());

        return fileRepository.save(fileEntity);
    }

    @Override
    public List<FileEntity> getAllFiles() {
        return fileRepository.findAll();
    }

    @Override
    public List<FileEntity> getUserFiles(Long userId) {
        return fileRepository.findByUserId(userId);
    }

    @Override
    public FileEntity getFileById(Long fileId) {
        return fileRepository.findById(fileId).orElse(null);
    }

    @Override
    public void deleteFile(Long fileId, Long userId) throws Exception {
        FileEntity fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new Exception("File not found"));

        if (!fileEntity.getUser().getId().equals(userId)) {
            throw new Exception("You are not authorized to delete this file.");
        }

        Files.deleteIfExists(UPLOAD_DIR.resolve(fileEntity.getFilePath()));
        fileRepository.delete(fileEntity);
    }

    @Override
    public ResponseEntity<Resource> downloadFileAsZip(Long fileId) throws Exception {
        FileEntity fileEntity = getFileById(fileId);
        if (fileEntity == null) {
            throw new Exception("File not found!");
        }

        Path filePath = UPLOAD_DIR.resolve(fileEntity.getFilePath());
        File file = filePath.toFile();

        if (!file.exists()) {
            throw new Exception("File not found on server!");
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            zipFile(file, zos);
        }

        ByteArrayResource resource = new ByteArrayResource(baos.toByteArray());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileEntity.getTitle() + ".zip\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    private void zipFile(File file, ZipOutputStream zos) throws IOException {
        try (FileInputStream fis = new FileInputStream(file)) {
            ZipEntry zipEntry = new ZipEntry(file.getName());
            zos.putNextEntry(zipEntry);
            byte[] buffer = new byte[1024];
            int length;
            while ((length = fis.read(buffer)) >= 0) {
                zos.write(buffer, 0, length);
            }
            zos.closeEntry();
        }
    }

    @Override
    public FileEntity updateFile(Long fileId, String title, String description, Long userId) throws Exception {
        FileEntity fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new Exception("File not found"));

        if (!fileEntity.getUser().getId().equals(userId)) {
            throw new Exception("Unauthorized update attempt");
        }

        fileEntity.setTitle(title);
        fileEntity.setDescription(description);
        return fileRepository.save(fileEntity);
    }

    @Override
    public Path getUploadDir() {
        return UPLOAD_DIR;
    }

    @Override
    public Resource downloadFile(Long fileId) throws Exception {
        FileEntity fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new Exception("File not found!"));

        Path filePath = UPLOAD_DIR.resolve(fileEntity.getFilePath());

        if (!Files.exists(filePath)) {
            throw new Exception("File not found on server!");
        }

        return new UrlResource(filePath.toUri());
    }

    @Override
    public ResponseEntity<Resource> viewFile(String fileName) throws Exception {
        Resource resource = loadFileAsResource(fileName);
        return ResponseEntity.ok()
                .body(resource);
    }

    @Override
    public Resource loadFileAsResource(String fileName) throws Exception {
        try {
            Path filePath = UPLOAD_DIR.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new Exception("File not found: " + fileName);
            }
        } catch (IOException ex) {
            throw new Exception("File not found: " + fileName, ex);
        }
    }

}
