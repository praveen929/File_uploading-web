package com.example.filestoring.service;

import com.example.filestoring.model.FileEntity;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

public interface FileService {
    FileEntity uploadFile(Long userId, MultipartFile file, String title, String description) throws Exception;

    List<FileEntity> getAllFiles();

    List<FileEntity> getUserFiles(Long userId);

    FileEntity getFileById(Long fileId);

    FileEntity updateFile(Long fileId, String title, String description, Long userId) throws Exception;

    void deleteFile(Long fileId, Long userId) throws Exception;

    ResponseEntity<Resource> downloadFileAsZip(Long fileId) throws Exception;

    Resource downloadFile(Long fileId) throws Exception;

    Path getUploadDir();

    // Add this method to the interface
    ResponseEntity<Resource> viewFile(String fileName) throws Exception;

    // Define the loadFileAsResource method to load the file
    Resource loadFileAsResource(String fileName) throws Exception;

    List<FileEntity> searchFiles(String query);



}
