package com.example.demo.model;

public class Project {
    private String id;
    private String name;
    private String description;
    private int slaHours;
    private String projectType; // e.g. Support, Development, Managed Service

    public Project(String id, String name, String description, int slaHours, String projectType) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.slaHours = slaHours;
        this.projectType = projectType;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getSlaHours() { return slaHours; }
    public void setSlaHours(int slaHours) { this.slaHours = slaHours; }
    public String getProjectType() { return projectType; }
    public void setProjectType(String projectType) { this.projectType = projectType; }
}
