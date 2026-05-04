package com.example.demo.model;

import java.time.LocalDateTime;

public class Ticket {
    private String id;
    private String title;
    private String description;
    private String projectId;
    private String priority; // Low, Medium, High, Critical
    private String status; // Open, In Progress, Resolved, Closed
    private LocalDateTime createdAt;

    public Ticket(String id, String title, String description, String projectId, String priority, String status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.projectId = projectId;
        this.priority = priority;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
