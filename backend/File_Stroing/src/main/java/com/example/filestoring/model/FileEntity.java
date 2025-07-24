package com.example.filestoring.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.Objects;

import com.example.filestoring.util.IdGenerator;

@Entity
@Table(name = "files")
public class FileEntity {

    @Id
    private Long id;

    private String title;

    @Lob
    private String description;

    private String fileUrl;

    private String filePath; // File path stored in DB

    @Temporal(TemporalType.TIMESTAMP) // Ensures correct DB mapping
    @Column(nullable = false, updatable = false) // Prevents modification after creation
    private Date createdDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public FileEntity() {
    }

    public FileEntity(String title, String description, String filePath, String fileUrl, User user) {
        this.title = title;
        this.description = description;
        this.filePath = filePath;
        this.fileUrl = fileUrl;
        this.user = user;
    }

    @PrePersist
    protected void onCreate() {
        this.createdDate = new Date(); // Auto-set createdDate before persisting

        // Generate 8-digit ID if not set
        if (this.id == null) {
            this.id = IdGenerator.generateEightDigitId();
        }
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    // Override toString, hashCode, and equals for better debugging and comparison

    @Override
    public String toString() {
        return "FileEntity{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", fileUrl='" + fileUrl + '\'' +
                ", filePath='" + filePath + '\'' +
                ", createdDate=" + createdDate +
                ", user=" + user +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        FileEntity that = (FileEntity) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
