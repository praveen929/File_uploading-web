package com.example.filestoring.controller;

import com.example.filestoring.model.FileEntity;
import com.example.filestoring.service.FileService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "https://filehuub.netlify.app"
})
@RestController
@RequestMapping("/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload/{userId}")
    public FileEntity uploadFile(@PathVariable Long userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description) throws Exception {
        return fileService.uploadFile(userId, file, title, description);
    }

    @GetMapping("/all")
    public List<FileEntity> getAllFiles() {
        return fileService.getAllFiles();
    }

    @GetMapping("/user/{userId}")
    public List<FileEntity> getUserFiles(@PathVariable Long userId) {
        return fileService.getUserFiles(userId);
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<FileEntity> getFileById(@PathVariable Long fileId) {
        FileEntity file = fileService.getFileById(fileId);
        return file != null ? ResponseEntity.ok(file) : ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{fileId}/{userId}")
    public FileEntity updateFile(@PathVariable Long fileId,
            @PathVariable Long userId,
            @RequestBody FileEntity updatedFile) throws Exception {
        return fileService.updateFile(fileId, updatedFile.getTitle(), updatedFile.getDescription(), userId);
    }

    @DeleteMapping("/delete/{fileId}/{userId}")
    public String deleteFile(@PathVariable Long fileId, @PathVariable Long userId) throws Exception {
        fileService.deleteFile(fileId, userId);
        return "File deleted successfully!";
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) throws Exception {
        // Get file entity to access metadata
        FileEntity fileEntity = fileService.getFileById(fileId);
        if (fileEntity == null) {
            return ResponseEntity.notFound().build();
        }

        // Get file resource
        Resource resource = fileService.downloadFile(fileId);

        // Determine content type from file extension
        String contentType = determineContentType(fileEntity.getFilePath());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileEntity.getTitle() + "\"")
                .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                .body(resource);
    }

    private String determineContentType(String fileName) {
        if (fileName == null)
            return "application/octet-stream";

        String extension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        switch (extension) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "webp":
                return "image/webp";
            case "svg":
                return "image/svg+xml";
            case "pdf":
                return "application/pdf";
            case "txt":
                return "text/plain";
            case "html":
                return "text/html";
            case "css":
                return "text/css";
            case "js":
                return "application/javascript";
            case "json":
                return "application/json";
            case "mp4":
                return "video/mp4";
            case "mp3":
                return "audio/mpeg";
            default:
                return "application/octet-stream";
        }
    }

    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFile(@PathVariable String fileName) throws Exception {
        return fileService.viewFile(fileName);
    }

    @GetMapping("/search")
    public List<FileEntity> searchFiles(@RequestParam String query) {
        return fileService.searchFiles(query);
    }
}
