package com.br.helpdesk.service;

import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.User;
import com.br.helpdesk.repository.TicketRepository;
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;
import org.apache.commons.collections.IteratorUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TicketService{
    
    @Resource
    private TicketRepository repository;
    
    public void setRepository(TicketRepository repository) {
        this.repository = repository;
    }
    
    public Ticket save(Ticket model){
        return repository.save(model);
    }
    public List<Ticket> findAll(){
        return IteratorUtils.toList(repository.findAll().iterator());
    }
    public void delete(Ticket model){
        repository.delete(model);
    } 
    public List<Ticket> findByUser(User user){
        return IteratorUtils.toList(repository.findByUser(user).iterator());
    }
    public List<Ticket> findByUserWithPaging(User user,Pageable pageable){
        return IteratorUtils.toList(repository.findByUser(user,pageable).iterator());
    }    
    public List<Ticket> findByIsOpen(Boolean isOpen){
        return IteratorUtils.toList(repository.findByIsOpen(isOpen).iterator());
    }
    public List<Ticket> findByIsOpenWithPaging(Boolean isOpen,Pageable pageable){
        return IteratorUtils.toList(repository.findByIsOpen(isOpen,pageable).iterator());
    }
    public List<Ticket> findByIsOpenAndUser(Boolean isOpen, User user){
        return IteratorUtils.toList(repository.findByIsOpenAndUser(isOpen,user).iterator());
    }
    public List<Ticket> findByIsOpenAndUserWithPaging(Boolean isOpen, User user,Pageable pageable){
        return IteratorUtils.toList(repository.findByIsOpenAndUser(isOpen,user,pageable).iterator());
    }
    public List<Ticket> findByResponsavel(User user){
        return IteratorUtils.toList(repository.findByResponsavelAndIsOpen(user,true).iterator());
    }
    public Ticket findById(Long codigo) {
        return repository.findOne(codigo);
    }
    public List<Ticket> findByResponsavelWithPaging(User user,Pageable pageable){
        return IteratorUtils.toList(repository.findByResponsavelAndIsOpen(user,true,pageable).iterator());
    }
    public List<Ticket> findAll(Pageable pageable) {
        Page<Ticket> tickets = repository.findAll(pageable);
        return tickets.getContent();
    }    
    public List<Ticket> findBetweenStartDate(Date firstDate, Date lastDate) {
        return IteratorUtils.toList(repository.findBetweenStartDate(firstDate, lastDate).iterator());
    }

    public List<Ticket> findBetweenEndDate(Date firstDate, Date lastDate) {
        return IteratorUtils.toList(repository.findBetweenEndDate(firstDate, lastDate).iterator());
    }

    public List<Ticket> findIsOpenUntilDate(Date lastDate) {
        return IteratorUtils.toList(repository.findIsOpenUntilDate(lastDate).iterator());
    }
}
