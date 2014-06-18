package com.br.helpdesk.service;

import com.br.helpdesk.model.Category;
import com.br.helpdesk.model.Client;
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
public class TicketService {

    @Resource
    private TicketRepository repository;

    public void setRepository(TicketRepository repository) {
        this.repository = repository;
    }

    public Ticket save(Ticket model) {
        return repository.save(model);
    }

    public List<Ticket> findAll() {
        return IteratorUtils.toList(repository.findAll().iterator());
    }

    public void delete(Ticket model) {
        repository.delete(model);
    }

    public List<Ticket> findByUser(User user) {
        return IteratorUtils.toList(repository.findByUser(user).iterator());
    }

    public List<Ticket> findByUserWithPaging(User user, Pageable pageable) {
        return IteratorUtils.toList(repository.findByUser(user, pageable).iterator());
    }

    public List<Ticket> findByIsOpen(Boolean isOpen) {
        return IteratorUtils.toList(repository.findByIsOpen(isOpen).iterator());
    }

    public List<Ticket> findByIsOpenWithPaging(Boolean isOpen, Pageable pageable) {
        return IteratorUtils.toList(repository.findByIsOpen(isOpen, pageable).iterator());
    }

    public List<Ticket> findByIsOpenAndUser(Boolean isOpen, User user) {
        return IteratorUtils.toList(repository.findByIsOpenAndUser(isOpen, user).iterator());
    }

    public List<Ticket> findByIsOpenAndUserWithPaging(Boolean isOpen, User user, Pageable pageable) {
        return IteratorUtils.toList(repository.findByIsOpenAndUser(isOpen, user, pageable).iterator());
    }

    public List<Ticket> findByResponsible(User user) {
        return IteratorUtils.toList(repository.findByResponsibleAndIsOpen(user, true).iterator());
    }

    public Ticket findById(Long codigo) {
        return repository.findOne(codigo);
    }

    public List<Ticket> findByResponsibleWithPaging(User user, Pageable pageable) {
        return IteratorUtils.toList(repository.findByResponsibleAndIsOpen(user, true, pageable).iterator());
    }

    public List<Ticket> findAll(Pageable pageable) {
        Page<Ticket> tickets = repository.findAll(pageable);
        return tickets.getContent();
    }

    public List<Ticket> findIsOpenUntilDate(Date lastDate) {
        return IteratorUtils.toList(repository.findIsOpenUntilDate(lastDate).iterator());
    }

    public List<Ticket> findBetweenStartDate(Date firstDate, Date lastDate) {
        return IteratorUtils.toList(repository.findBetweenStartDate(firstDate, lastDate).iterator());
    }

    public List<Ticket> findBetweenEndDate(Date firstDate, Date lastDate) {
        return IteratorUtils.toList(repository.findBetweenEndDate(firstDate, lastDate).iterator());
    }

    public List<Ticket> findIsOpenUntilDateAndCategorySomeAlreadyClosed(Date lastDate, long categoryId) {
        return IteratorUtils.toList(repository.findIsOpenUntilDateAndCategorySomeAlreadyClosed(lastDate, categoryId).iterator());
    }

    public List<Ticket> findIsOpenUntilDateAndCategory(Date lastDate, long categoryId) {
        return IteratorUtils.toList(repository.findIsOpenUntilDateAndCategory(lastDate, categoryId).iterator());
    }

    public List<Ticket> findBetweenStartDateAndCategory(Date firstDate, Date lastDate, long categoryId) {
        return IteratorUtils.toList(repository.findBetweenStartDateAndCategory(firstDate, lastDate, categoryId).iterator());
    }

    public List<Ticket> findBetweenEndDateAndCategory(Date firstDate, Date lastDate, long categoryId) {
        return IteratorUtils.toList(repository.findBetweenEndDateAndCategory(firstDate, lastDate, categoryId).iterator());
    }

    public List<Ticket> findIsOpenUntilDateAndClientSomeAlreadyClosed(Date lastDate, long clientId) {
        return IteratorUtils.toList(repository.findIsOpenUntilDateAndClientSomeAlreadyClosed(lastDate, clientId).iterator());
    }

    public List<Ticket> findIsOpenUntilDateAndClient(Date lastDate, long clientId) {
        return IteratorUtils.toList(repository.findIsOpenUntilDateAndClient(lastDate, clientId).iterator());
    }

    public List<Ticket> findBetweenStartDateAndClient(Date firstDate, Date lastDate, long clientId) {
        return IteratorUtils.toList(repository.findBetweenStartDateAndClient(firstDate, lastDate, clientId).iterator());
    }

    public List<Ticket> findBetweenEndDateAndClient(Date firstDate, Date lastDate, long clientId) {
        return IteratorUtils.toList(repository.findBetweenEndDateAndClient(firstDate, lastDate, clientId).iterator());
    }

    public List<Ticket> findIsOpenUntilDateAndUser(Date lastDate, long userId) {
        return IteratorUtils.toList(repository.findIsOpenUntilDateAndUser(lastDate, userId).iterator());
    }

    public List<Ticket> findBetweenStartDateAndUser(Date firstDate, Date lastDate, long userId) {
        return IteratorUtils.toList(repository.findBetweenStartDateAndUser(firstDate, lastDate, userId).iterator());
    }

    public List<Ticket> findBetweenEndDateAndUser(Date firstDate, Date lastDate, long userId) {
        return IteratorUtils.toList(repository.findBetweenEndDateAndUser(firstDate, lastDate, userId).iterator());
    }
}
