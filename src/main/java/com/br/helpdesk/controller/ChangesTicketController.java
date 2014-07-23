/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.controller;

import com.br.helpdesk.model.Category;
import com.br.helpdesk.model.ChangesTicket;
import com.br.helpdesk.model.Priority;
import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.User;
import com.br.helpdesk.service.ChangesTicketService;
import com.br.helpdesk.service.TicketService;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author Sulivam
 */
@Controller
@RequestMapping("/changes-ticket")
public class ChangesTicketController {

    @Autowired
    private ChangesTicketService changesTicketService;

    public void setService(ChangesTicketService service) {
        this.changesTicketService = service;
    }

    @Autowired
    public ChangesTicketController(ChangesTicketService service) {
        this.changesTicketService = service;
    }
    
    @Autowired
    private TicketService ticketService;

    public void setTicketService(TicketService service) {
        this.ticketService = service;
    }

    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List<ChangesTicket> getAllChangesTicket() {
        return changesTicketService.findAll();
    } 
    
    public ChangesTicket save(Ticket olderTicket, Ticket newTicket, User user){
        return changesTicketService.save(olderTicket, newTicket, user);
    }
    
    @RequestMapping(value = "/{ticketId}", method = RequestMethod.GET)
    @ResponseBody
    public List<ChangesTicket> getFilesListFromTicket(@PathVariable(value = "ticketId") Long ticketId) throws Exception {
        Ticket ticket = ticketService.findById(ticketId);
        List<ChangesTicket> changes = changesTicketService.findByTicket(ticket);
        return changes;
    }
}
