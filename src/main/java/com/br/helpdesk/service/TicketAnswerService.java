/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.service;

import com.br.helpdesk.model.Client;
import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.TicketAnswer;
import com.br.helpdesk.repository.ClientRepository;
import com.br.helpdesk.repository.TicketAnswerRepository;
import java.util.List;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;

/**
 *
 * @author ricardo
 */

@Service
public class TicketAnswerService {
    
    @Resource
    private TicketAnswerRepository repository;
    
    public void setRepository(TicketAnswerRepository repository) {
        this.repository = repository;
    }    
    
    public Iterable<TicketAnswer> findAll() {
        return repository.findAll();
    }
    
    public TicketAnswer findOne(Long id){
        return repository.findOne(id);
    }
    
    public TicketAnswer save(TicketAnswer answer){
        return repository.save(answer);
    }
    
    public List<TicketAnswer> findAnswersByTicket(Ticket ticket){
        return repository.getAnswersByTicket(ticket.getId());
    }
    
}
