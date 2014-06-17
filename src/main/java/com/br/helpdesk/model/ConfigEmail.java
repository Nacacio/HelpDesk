/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.model;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 *
 * @author Sulivam
 */
@Entity
@Table(name="CONFIG_EMAIL")
public class ConfigEmail {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private Long id;

    @Basic
    @Column(name = "IMAPS")
    private String imaps;
    
    @Basic
    @Column(name = "IMAP")
    private String imap;
    
    @Basic
    @Column(name = "USER")
    private String user;
    
    @Basic
    @Column(name = "PASSWORD")
    private String password;
    
    @Basic
    @Column(name = "FOLDER")
    private String folder;
    
    @Basic
    @Column(name = "SMTP")
    private String smtp;
    
    @Basic
    @Column(name = "PORT")
    private String port;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImaps() {
        return imaps;
    }

    public void setImaps(String imaps) {
        this.imaps = imaps;
    }

    public String getImap() {
        return imap;
    }

    public void setImap(String imap) {
        this.imap = imap;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFolder() {
        return folder;
    }

    public void setFolder(String folder) {
        this.folder = folder;
    }

    public String getSmtp() {
        return smtp;
    }

    public void setSmtp(String smtp) {
        this.smtp = smtp;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    

}
