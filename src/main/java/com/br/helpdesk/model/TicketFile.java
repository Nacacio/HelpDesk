package com.br.helpdesk.model;

import javax.persistence.*;
import org.codehaus.jackson.annotate.JsonAutoDetect;

/**
 * Created with IntelliJ IDEA.
 * User: rafaelpossas
 Date: 10/18/13
 Time: 1:59 PM
 To change this template use TicketFile | Settings | TicketFile Templates.
 */
@Entity
@Table(name = "TICKET_FILE")
@JsonAutoDetect(getterVisibility = JsonAutoDetect.Visibility.ANY, fieldVisibility = JsonAutoDetect.Visibility.NONE, setterVisibility = JsonAutoDetect.Visibility.ANY)
public class TicketFile{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="ID")
    private Long id;
    
    @Basic
    @Column(name= "ARQ_NOME")
    private String name;
        
    @ManyToOne
    @JoinColumn(name="TICKET_ID")
    private Ticket ticket;
    
    @ManyToOne
    @JoinColumn(name="TICKET_ANSWER_ID")
    private TicketAnswer ticketAnswer;
    
    @Lob
    @Column(name="ARQ_BYTE",nullable=false)
    private byte[] byteArquivo;
    
    @Basic
    @Column(name= "CONTENT_TYPE")
    private String contentType;
    


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public byte[] getByteArquivo() {
        return byteArquivo;
    }

    public void setByteArquivo(byte[] byteArquivo) {
        this.byteArquivo = byteArquivo;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TicketAnswer getTicketAnswer() {
        return ticketAnswer;
    }

    public void setTicketAnswer(TicketAnswer ticketAnswer) {
        this.ticketAnswer = ticketAnswer;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    
    
}
