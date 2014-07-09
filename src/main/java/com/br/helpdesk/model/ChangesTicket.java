/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.model;

import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 *
 * @author Sulivam
 *
 * Classe que registrará todas as mudanças feitas nos tickets. <br>
 * Mudança de Categoria, Prioridade, Prazo Estimado, Responsável e abertura e
 * fechamento.
 */
@Entity
@Table(name = "CHANGES_TICKET")
public class ChangesTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = true)
    private User user;

    @Basic
    @Column(name = "DATE_CREATION", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;

    @ManyToOne
    @JoinColumn(name = "TICKET_ID", nullable = true)
    private Ticket ticket;

    @ManyToOne
    @JoinColumn(name = "OLDER_RESPONSIBLE", nullable = true)
    private User olderResponsible;

    @ManyToOne
    @JoinColumn(name = "NEW_RESPONSIBLE", nullable = true)
    private User newResponsible;

    @ManyToOne
    @JoinColumn(name = "OLDER_CATEGORY", nullable = true)
    private Category olderCategory;

    @ManyToOne
    @JoinColumn(name = "NEW_CATEGORY", nullable = true)
    private Category newCategory;

    @ManyToOne
    @JoinColumn(name = "OLDER_PRIORITY", nullable = true)
    private Priority olderPriority;

    @ManyToOne
    @JoinColumn(name = "NEW_PRIORITY", nullable = true)
    private Priority newPriority;

    @Basic
    @Column(name = "OLDER_ESTIMATED_TIME", nullable = true)
    @Temporal(TemporalType.DATE)
    private Date olderEstimatedTime;

    @Basic
    @Column(name = "NEW_ESTIMATED_TIME", nullable = true)
    @Temporal(TemporalType.DATE)
    private Date newEstimatedTime;

    @Basic
    @Column(name = "OLDER_STATE_TICKET", nullable = true)
    private Boolean olderStateTicket;

    @Basic
    @Column(name = "NEW_STATE_TICKET", nullable = true)
    private Boolean newStateTicket;
    
    @ManyToOne
    @JoinColumn(name="ANSWER_ID",nullable = true)
    private TicketAnswer ticketAnswer;  

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public Date getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }

    public User getOlderResponsible() {
        return olderResponsible;
    }

    public void setOlderResponsible(User olderResponsible) {
        this.olderResponsible = olderResponsible;
    }

    public User getNewResponsible() {
        return newResponsible;
    }

    public void setNewResponsible(User newResponsible) {
        this.newResponsible = newResponsible;
    }

    public Category getOlderCategory() {
        return olderCategory;
    }

    public void setOlderCategory(Category olderCategory) {
        this.olderCategory = olderCategory;
    }

    public Category getNewCategory() {
        return newCategory;
    }

    public void setNewCategory(Category newCategory) {
        this.newCategory = newCategory;
    }

    public Priority getOlderPriority() {
        return olderPriority;
    }

    public void setOlderPriority(Priority olderPriority) {
        this.olderPriority = olderPriority;
    }

    public Priority getNewPriority() {
        return newPriority;
    }

    public void setNewPriority(Priority newPriority) {
        this.newPriority = newPriority;
    }

    public Date getOlderEstimatedTime() {
        return olderEstimatedTime;
    }

    public void setOlderEstimatedTime(Date olderEstimatedTime) {
        this.olderEstimatedTime = olderEstimatedTime;
    }

    public Date getNewEstimatedTime() {
        return newEstimatedTime;
    }

    public void setNewEstimatedTime(Date newEstimatedTime) {
        this.newEstimatedTime = newEstimatedTime;
    }

    public Boolean isOlderStateTicket() {
        return olderStateTicket;
    }

    public void setOlderStateTicket(Boolean olderStateTicket) {
        this.olderStateTicket = olderStateTicket;
    }

    public Boolean isNewStateTicket() {
        return newStateTicket;
    }

    public void setNewStateTicket(Boolean newStateTicket) {
        this.newStateTicket = newStateTicket;
    }
    
    public TicketAnswer getTicketAnswer() {
        return ticketAnswer;
    }

    public void setTicketAnswer(TicketAnswer ticketAnswer) {
        this.ticketAnswer = ticketAnswer;
    }
    
}
