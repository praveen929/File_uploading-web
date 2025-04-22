package com.example.filestoring.controller;

import com.example.filestoring.model.FileEntity;
import com.example.filestoring.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "https://filehuub.netlify.app/")
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
        return ResponseEntity.ok()
                .body(fileService.downloadFile(fileId));
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
