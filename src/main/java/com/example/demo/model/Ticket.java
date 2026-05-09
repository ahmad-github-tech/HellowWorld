package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String projectId;
    private String priority; // Low, Medium, High, Critical
    private String status; // Open, In Progress, Resolved, Closed, Hold
    private String ticketType; // Incident, Service Request, Problem, Change
    private String ticketCategory; // L1, L2, L3, L4
    
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdAt;
    
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime responseDateTime;
    
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime resolutionDateTime;
    
    private String remarks;

    public Ticket() {
        this.createdAt = LocalDateTime.now();
    }

    public Ticket(Long id, String title, String description, String projectId, String priority, String status) {
        this();
        this.id = id;
        this.title = title;
        this.description = description;
        this.projectId = projectId;
        this.priority = priority;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getTicketType() { return ticketType; }
    public void setTicketType(String ticketType) { this.ticketType = ticketType; }
    
    public LocalDateTime getResponseDateTime() { return responseDateTime; }
    public void setResponseDateTime(LocalDateTime responseDateTime) { this.responseDateTime = responseDateTime; }
    
    public LocalDateTime getResolutionDateTime() { return resolutionDateTime; }
    public void setResolutionDateTime(LocalDateTime resolutionDateTime) { this.resolutionDateTime = resolutionDateTime; }
    
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getTicketCategory() { return ticketCategory; }
    public void setTicketCategory(String ticketCategory) { this.ticketCategory = ticketCategory; }
}
