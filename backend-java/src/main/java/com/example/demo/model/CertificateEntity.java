package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "certificates")
public class CertificateEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String issuer;

    private LocalDate date;
    private String category;
    private String imageUrl;
    private String takeaway;
    private String status;

    @OneToMany(mappedBy = "certificate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ModuleEntity> modules = new ArrayList<>();

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

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTakeaway() {
        return takeaway;
    }

    public void setTakeaway(String takeaway) {
        this.takeaway = takeaway;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<ModuleEntity> getModules() {
        return modules;
    }

    public void setModules(List<ModuleEntity> modules) {
        this.modules.clear();
        if (modules != null) {
            for (ModuleEntity module : modules) {
                module.setCertificate(this);
                this.modules.add(module);
            }
        }
    }
}
