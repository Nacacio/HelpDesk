/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.service;

import com.br.helpdesk.model.Category;
import com.br.helpdesk.model.ChangesTicket;
import com.br.helpdesk.model.Priority;
import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.TicketAnswer;
import com.br.helpdesk.model.User;
import com.br.helpdesk.repository.ChangesTicketRepository;
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;
import org.apache.commons.collections.IteratorUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Sulivam
 */
@Service
public class ChangesTicketService {

    @Resource
    private ChangesTicketRepository repository;

    public void setRepository(ChangesTicketRepository repository) {
        this.repository = repository;
    }
    
    @Autowired
    private TicketAnswerService ticketAnswerService;

    public void setTicketAnswerService(TicketAnswerService service) {
        this.ticketAnswerService = service;
    }    

    public List<ChangesTicket> findAll() {
        return IteratorUtils.toList(repository.findAll().iterator());
    }

    public List<ChangesTicket> findByUser(User user) {
        return IteratorUtils.toList(repository.findByUser(user).iterator());
    }

    public List<ChangesTicket> findByTicket(Ticket ticket) {
        return IteratorUtils.toList(repository.findByTicket(ticket).iterator());
    }

    public ChangesTicket save(Ticket olderTicket, Ticket newTicket, User user) {
        ChangesTicket changesTicket = new ChangesTicket();

        changesTicket = compareCategory(changesTicket, olderTicket, newTicket);
        changesTicket = compareEstimatedDate(changesTicket, olderTicket, newTicket);
        changesTicket = comparePriority(changesTicket, olderTicket, newTicket);
        changesTicket = compareResponsible(changesTicket, olderTicket, newTicket);
        changesTicket = compareStateTicket(changesTicket, olderTicket, newTicket);

        if (hasChange(changesTicket)) {
            changesTicket.setUser(user);
            changesTicket.setDateCreation(new Date());
            //procura a ultima resposta do ticket pra saber em qual momento foi feita a mudança.
            TicketAnswer ticketAnswer = ticketAnswerService.findLastAnswersByTicket(newTicket);
            if(ticketAnswer!=null){
                changesTicket.setTicketAnswer(ticketAnswer);
            }
            changesTicket.setTicket(newTicket);
            changesTicket = repository.save(changesTicket);
        }

        return changesTicket;
    }

    /**
     * @author andresulivam
     *
     * Método que verifica se o responsável foi alterado no ticket.<br>
     * Se foi alterado, ele insere em changesTickets o valor antigo e o novo.
     *
     * @param changesTicket
     * @param olderTicket
     * @param newTicket
     * @return changesTicket
     */
    public ChangesTicket compareResponsible(ChangesTicket changesTicket, Ticket olderTicket, Ticket newTicket) {
        if (changesTicket == null) {
            changesTicket = new ChangesTicket();
        }

        User olderValue = olderTicket.getResponsible();
        User newValue = newTicket.getResponsible();

        if ((olderValue == null && newValue != null)
                || (olderValue != null && newValue == null)
                || ((olderValue != null && newValue != null) && (!olderValue.getId().equals(newValue.getId())))) {
            changesTicket.setOlderResponsible(olderValue);
            changesTicket.setNewResponsible(newValue);
        }

        return changesTicket;
    }

    /**
     * @author andresulivam
     *
     * Método que verifica se a categoria foi alterada no ticket.<br>
     * Se foi alterada, ele insere em changesTickets o valor antigo e o novo.
     *
     * @param changesTicket
     * @param olderTicket
     * @param newTicket
     * @return changesTicket
     */
    public ChangesTicket compareCategory(ChangesTicket changesTicket, Ticket olderTicket, Ticket newTicket) {
        if (changesTicket == null) {
            changesTicket = new ChangesTicket();
        }

        Category olderValue = olderTicket.getCategory();
        Category newValue = newTicket.getCategory();

        if ((olderValue == null && newValue != null)
                || (olderValue != null && newValue == null)
                || ((olderValue != null && newValue != null) && (!olderValue.getId().equals(newValue.getId())))) {
            changesTicket.setOlderCategory(olderValue);
            changesTicket.setNewCategory(newValue);
        }

        return changesTicket;
    }

    /**
     * @author andresulivam
     *
     * Método que verifica se a categoria foi alterada no ticket.<br>
     * Se foi alterada, ele insere em changesTickets o valor antigo e o novo.
     *
     * @param changesTicket
     * @param olderTicket
     * @param newTicket
     * @return changesTicket
     */
    public ChangesTicket comparePriority(ChangesTicket changesTicket, Ticket olderTicket, Ticket newTicket) {
        if (changesTicket == null) {
            changesTicket = new ChangesTicket();
        }

        Priority olderValue = olderTicket.getPriority();
        Priority newValue = newTicket.getPriority();

        if ((olderValue == null && newValue != null)
                || (olderValue != null && newValue == null)
                || ((olderValue != null && newValue != null) && (!olderValue.getId().equals(newValue.getId())))) {
            changesTicket.setOlderPriority(olderValue);
            changesTicket.setNewPriority(newValue);
        }

        return changesTicket;
    }

    /**
     * @author andresulivam
     *
     * Método que verifica se a categoria foi alterada no ticket.<br>
     * Se foi alterada, ele insere em changesTickets o valor antigo e o novo.
     *
     * @param changesTicket
     * @param olderTicket
     * @param newTicket
     * @return changesTicket
     */
    public ChangesTicket compareEstimatedDate(ChangesTicket changesTicket, Ticket olderTicket, Ticket newTicket) {
        if (changesTicket == null) {
            changesTicket = new ChangesTicket();
        }

        Date olderValue = olderTicket.getEstimateTime();
        Date newValue = newTicket.getEstimateTime();

        if ((olderValue == null && newValue != null)
                || (olderValue != null && newValue == null)
                || ((olderValue != null && newValue != null) && (olderValue.getTime() != newValue.getTime()))) {
            changesTicket.setOlderEstimatedTime(olderValue);
            changesTicket.setNewEstimatedTime(newValue);
        }
        return changesTicket;
    }

    /**
     * @author andresulivam
     *
     * Método que verifica se a categoria foi alterada no ticket.<br>
     * Se foi alterada, ele insere em changesTickets o valor antigo e o novo.
     *
     * @param changesTicket
     * @param olderTicket
     * @param newTicket
     * @return changesTicket
     */
    public ChangesTicket compareStateTicket(ChangesTicket changesTicket, Ticket olderTicket, Ticket newTicket) {
        if (changesTicket == null) {
            changesTicket = new ChangesTicket();
        }

        boolean olderValue = olderTicket.isIsOpen();
        boolean newValue = newTicket.isIsOpen();

        if (olderValue != newValue) {
            changesTicket.setOlderStateTicket(olderValue);
            changesTicket.setNewStateTicket(newValue);
        }

        return changesTicket;
    }

    /**
     * @author andresulivam
     *
     * Verifica se houve mudança para ser salva.
     * @param changesTicket
     * @return
     */
    public boolean hasChange(ChangesTicket changesTicket) {

        return changesTicket.getNewCategory() != null
                || changesTicket.getOlderCategory() != null
                || changesTicket.getNewEstimatedTime() != null
                || changesTicket.getOlderEstimatedTime() != null
                || changesTicket.getNewPriority() != null
                || changesTicket.getOlderPriority() != null
                || changesTicket.getNewResponsible() != null
                || changesTicket.getOlderResponsible() != null
                || changesTicket.isNewStateTicket() != null
                || changesTicket.isOlderStateTicket();
    }

}
