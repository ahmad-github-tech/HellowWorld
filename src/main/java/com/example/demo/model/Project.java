package com.example.demo.model;
import jakarta.persistence.*;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String projectType; // e.g. Support, Development, Managed Service
    private String businessHours; // e.g. 24/7, 9-5 Mon-Fri
    private String timezone;

    // SLA Details
    private int p1Response;
    private int p1Resolution;
    private int p2Response;
    private int p2Resolution;
    private int p3Response;
    private int p3Resolution;
    private int p4Response;
    private int p4Resolution;

    public Project() {
        // Defaults
        this.p1Response = 2; this.p1Resolution = 4;
        this.p2Response = 4; this.p2Resolution = 8;
        this.p3Response = 8; this.p3Resolution = 24;
        this.p4Response = 24; this.p4Resolution = 48;
    }

    public Project(Long id, String name, String description, String projectType, String businessHours, String timezone) {
        this();
        this.id = id;
        this.name = name;
        this.description = description;
        this.projectType = projectType;
        this.businessHours = businessHours;
        this.timezone = timezone;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getProjectType() { return projectType; }
    public void setProjectType(String projectType) { this.projectType = projectType; }
    public String getBusinessHours() { return businessHours; }
    public void setBusinessHours(String businessHours) { this.businessHours = businessHours; }
    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public int getP1Response() { return p1Response; }
    public void setP1Response(int p1Response) { this.p1Response = p1Response; }
    public int getP1Resolution() { return p1Resolution; }
    public void setP1Resolution(int p1Resolution) { this.p1Resolution = p1Resolution; }
    public int getP2Response() { return p2Response; }
    public void setP2Response(int p2Response) { this.p2Response = p2Response; }
    public int getP2Resolution() { return p2Resolution; }
    public void setP2Resolution(int p2Resolution) { this.p2Resolution = p2Resolution; }
    public int getP3Response() { return p3Response; }
    public void setP3Response(int p3Response) { this.p3Response = p3Response; }
    public int getP3Resolution() { return p3Resolution; }
    public void setP3Resolution(int p3Resolution) { this.p3Resolution = p3Resolution; }
    public int getP4Response() { return p4Response; }
    public void setP4Response(int p4Response) { this.p4Response = p4Response; }
    public int getP4Resolution() { return p4Resolution; }
    public void setP4Resolution(int p4Resolution) { this.p4Resolution = p4Resolution; }
}
