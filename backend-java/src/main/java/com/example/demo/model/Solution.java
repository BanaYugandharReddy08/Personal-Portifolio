package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Solution {
    @Column(name = "solution_js", columnDefinition = "text")
    private String javascript;

    @Column(name = "solution_python", columnDefinition = "text")
    private String python;

    public String getJavascript() {
        return javascript;
    }

    public void setJavascript(String javascript) {
        this.javascript = javascript;
    }

    public String getPython() {
        return python;
    }

    public void setPython(String python) {
        this.python = python;
    }
}
