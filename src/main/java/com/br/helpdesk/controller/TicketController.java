package com.br.helpdesk.controller;

import com.Consts;
import com.br.helpdesk.model.Attachments;
import com.br.helpdesk.model.Category;
import com.br.helpdesk.model.Priority;
import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.User;
import com.br.helpdesk.service.EmailService;
import com.br.helpdesk.service.AttachmentsService;
import com.br.helpdesk.service.CategoryService;
import com.br.helpdesk.service.PriorityService;
import com.br.helpdesk.service.TicketAnswerService;
import com.br.helpdesk.service.TicketService;
import com.br.helpdesk.service.UserService;
import java.io.File;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
@RequestMapping("/ticket")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    public void setService(TicketService service) {
        this.ticketService = service;
    }

    @Autowired
    public TicketController(TicketService service) {
        this.ticketService = service;
    }

    @Autowired
    private UserService userService;

    public void setUserService(UserService service) {
        this.userService = service;
    }

    @Autowired
    private AttachmentsService attachmentsService;

    public void setFileService(AttachmentsService service) {
        this.attachmentsService = service;
    }

    @Autowired
    private EmailService emailService;

    public void setEmailService(EmailService service) {
        this.emailService = service;
    }

    @Autowired
    private TicketAnswerService ticketAnswerService;

    public void setTicketAnswerService(TicketAnswerService service) {
        this.ticketAnswerService = service;
    }

    @Autowired
    private PriorityService priorityService;

    public void setPriorityService(PriorityService service) {
        this.priorityService = service;
    }

    @Autowired
    private CategoryService categoryService;

    public void setCategoryService(CategoryService service) {
        this.categoryService = service;
    }

    @Autowired
    private ChangesTicketController changesTicketController;

    public void setChangesTicketController(ChangesTicketController controller) {
        this.changesTicketController = controller;
    }

    /**
     * FindAll sem registro de qual usuário fez a requisição.
     * @return 
     */
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List<Ticket> getAllTickets() {
        return ticketService.findAll();
    }

    /**
     * FindAll com registro do usuário que fez a requisição.
     * @param username
     * @return 
     */
    @RequestMapping(value = "/all", method = RequestMethod.GET, params = {"user"})
    public @ResponseBody
    List<Ticket> getAllTicketsByUser(@RequestParam(value = "user") String username) {
        User user = this.userService.findByUserName(username);
        if (user.getUserGroup().getId() == Consts.ADMIN_GROUP_ID) {//SUPERUSER
            return ticketService.findAll(user);
        } else {
            return ticketService.findByUser(user);
        }
    }

    @RequestMapping(value = "/all-paging", method = RequestMethod.GET, params = {"user", "start", "limit"})
    public @ResponseBody
    List<Ticket> getAllTicketsByUserPaging(@RequestParam(value = "user") String username, @RequestParam(value = "start") int start, @RequestParam(value = "limit") int limit) {
        User user = this.userService.findByUserName(username);
        PageRequest pageRequest = getPageRequest(limit, start);

        if (user.getUserGroup().getId() == Consts.ADMIN_GROUP_ID) {//SUPERUSER
            return ticketService.findAll(pageRequest);
        } else {
            return ticketService.findByUserWithPaging(user, pageRequest);
        }
    }

    @RequestMapping(value = "/opened", method = RequestMethod.GET, params = {"user"})
    public @ResponseBody
    List<Ticket> getTicketsOpenedByUser(@RequestParam(value = "user") String username) {
        User user = this.userService.findByUserName(username);

        if (user.getUserGroup().getId() == Consts.ADMIN_GROUP_ID) {//SUPERUSER
            return ticketService.findByIsOpen(true);
        } else {
            return ticketService.findByIsOpenAndUser(true, user);
        }
    }

    @RequestMapping(value = "/opened-paging", method = RequestMethod.GET, params = {"user", "start", "limit"})
    public @ResponseBody
    List<Ticket> getTicketsOpenedByUserWithPaging(@RequestParam(value = "user") String username, @RequestParam(value = "start") int start, @RequestParam(value = "limit") int limit) {
        User user = this.userService.findByUserName(username);
        PageRequest pageRequest = getPageRequest(limit, start);

        if (user.getUserGroup().getId() == Consts.ADMIN_GROUP_ID) {//SUPERUSER
            return ticketService.findByIsOpenWithPaging(true, pageRequest, user);
        } else {
            return ticketService.findByIsOpenAndUser(true, user);
        }
    }

    @RequestMapping(value = "/closed", method = RequestMethod.GET, params = {"user"})
    public @ResponseBody
    List<Ticket> getTicketsClosedByUser(@RequestParam(value = "user") String username) {
        User user = this.userService.findByUserName(username);
        if (user.getUserGroup().getId() == Consts.ADMIN_GROUP_ID) {//SUPERUSER
            return ticketService.findByIsOpen(false);
        } else {
            return ticketService.findByIsOpenAndUser(false, user);
        }
    }

    @RequestMapping(value = "/closed-paging", method = RequestMethod.GET, params = {"user", "start", "limit"})
    public @ResponseBody
    List<Ticket> getTicketsClosedByUserWithPaging(@RequestParam(value = "user") String username, @RequestParam(value = "start") int start, @RequestParam(value = "limit") int limit) {
        User user = this.userService.findByUserName(username);
        PageRequest pageRequest = getPageRequest(limit, start);

        if (user.getUserGroup().getId() == Consts.ADMIN_GROUP_ID) {//SUPERUSER
            return ticketService.findByIsOpenWithPaging(false, pageRequest, user);
        } else {
            return ticketService.findByIsOpenAndUserWithPaging(false, user, pageRequest);
        }
    }

    @RequestMapping(value = "/mytickets", method = RequestMethod.GET, params = {"user"})
    public @ResponseBody
    List<Ticket> getMyTickets(@RequestParam(value = "user") String username) {
        User user = this.userService.findByUserName(username);
        return ticketService.findByResponsible(user);
    }

    @RequestMapping(value = "/mytickets-paging", method = RequestMethod.GET, params = {"user", "start", "limit"})
    public @ResponseBody
    List<Ticket> getMyTicketsWithPaging(@RequestParam(value = "user") String username, @RequestParam(value = "start") int start, @RequestParam(value = "limit") int limit) {
        User user = this.userService.findByUserName(username);
        PageRequest pageRequest = getPageRequest(limit, start);
        return ticketService.findByResponsibleWithPaging(user, pageRequest);
    }

    @RequestMapping(value = "/withoutresponsible", method = RequestMethod.GET, params = {"user"})
    public @ResponseBody
    List<Ticket> getTicketsWithoutResponsible(@RequestParam(value = "user") String username) {
        return ticketService.findByResponsible(null);
    }

    @RequestMapping(value = "/withoutresponsible-paging", method = RequestMethod.GET, params = {"user", "start", "limit"})
    public @ResponseBody
    List<Ticket> getTicketsWithoutResponsibleWithPaging(@RequestParam(value = "user") String username, @RequestParam(value = "start") int start, @RequestParam(value = "limit") int limit) {
        PageRequest pageRequest = getPageRequest(limit, start);
        return ticketService.findByResponsibleWithPaging(null, pageRequest);
    }

    @RequestMapping(value = "/textmenu", method = RequestMethod.GET, params = {"user"}, produces = "application/json;charset=UTF-8")
    public @ResponseBody
    String getTextMenu(@RequestParam(value = "user") String username, HttpServletResponse response) throws UnsupportedEncodingException {
        User user = this.userService.findByUserName(username);
        int todos, abertos, fechados, withoutresponsible, mytickets;
        if (user.getUserGroup().getId() == Consts.ADMIN_GROUP_ID) {//SUPERUSER
            todos = ticketService.findAll().size();
            abertos = ticketService.findByIsOpen(true).size();
            fechados = ticketService.findByIsOpen(false).size();
            mytickets = ticketService.findByResponsible(user).size();
            withoutresponsible = ticketService.findByResponsible(null).size();
        } else {
            todos = ticketService.findByUser(user).size();
            abertos = ticketService.findByIsOpenAndUser(true, user).size();
            fechados = ticketService.findByIsOpenAndUser(false, user).size();
            mytickets = 0;
            withoutresponsible = 0;
        }
        return "{\"todos\":'" + todos + "', \"abertos\": '" + abertos + "', \"fechados\": '" + fechados + "', \"mytickets\": '" + mytickets + "', \"withoutresponsible\": '" + withoutresponsible + "'}";
    }

    @RequestMapping(value = {"close-ticket/{id}"}, method = {RequestMethod.PUT})
    @ResponseBody
    public Ticket closeTicket(@RequestBody Ticket ticket, @RequestParam(value = "user") String username) {
        User user = userService.findByUserName(username);
        Ticket olderTicket = ticketService.findById(ticket.getId());
        ticket.setIsOpen(false);
        ticket.setEndDate(Calendar.getInstance().getTime());
        ticket = ticketService.save(ticket);
        if (olderTicket != null) {
            changesTicketController.save(olderTicket, ticket, user);
        }
        List<String> emails = emailService.getListEmailsToSend(olderTicket, ticket, null);
        if (emails.size() > 0) {
            emailService.sendEmail(olderTicket, null, null, null, emails, Consts.TICKET_CLOSE);
        }
        return ticket;
    }

    @RequestMapping(value = {"open-ticket/{id}"}, method = {RequestMethod.PUT})
    @ResponseBody
    public Ticket openTicket(@RequestBody Ticket ticket, @RequestParam(value = "user") String username) {        
        User user = userService.findByUserName(username);
        Ticket olderTicket = ticketService.findById(ticket.getId());
        ticket.setIsOpen(true);
        ticket.setEndDate(null);
        ticket = ticketService.save(ticket);
        if (olderTicket != null) {
            changesTicketController.save(olderTicket, ticket, user);
        }
        List<String> emails = emailService.getListEmailsToSend(olderTicket, ticket, null);
        if (emails.size() > 0) {
            emailService.sendEmail(olderTicket, null, null, null, emails, Consts.TICKET_OPEN);
        }
        return ticket;
    }

    @RequestMapping(value = {"", "/{id}"}, method = {RequestMethod.POST, RequestMethod.PUT}, params = {"user"})
    @ResponseBody
    public Ticket save(@RequestBody Ticket ticket, @RequestParam(value = "user") String username) throws IOException {
        User user = userService.findByUserName(username);
        List<File> filesToSave = attachmentsService.getAttachmentsFromUser(username);

        List<String> emails = new ArrayList<String>();
        Ticket olderTicket = null;

        if (!(ticket.getId() == null)) {
            olderTicket = ticketService.findById(ticket.getId());
        } else {
            ticket.setStartDate(new Date());
        }

        if (ticket.getPriority() == null) {
            //buscando 'sem prioridade'
            Priority priority = priorityService.findById(1L);
            ticket.setPriority(priority);
        }
        //buscando novamente a categoria no banco porque o valor do 'name' está vindo do extjs com o valor de translations
        Category category = categoryService.findById(ticket.getCategory().getId());
        ticket.setCategory(category);
        if (olderTicket == null) {            
            ticket.setLastInteration(ticket.getStartDate());
            ticket.setUserLastInteration(ticket.getUser());
        }
        ticket = ticketService.save(ticket);

        if (olderTicket != null) {            
            changesTicketController.save(olderTicket, ticket, user);
        }

        Attachments attachment = null;
        for (File file : filesToSave) {
            attachment = new Attachments();
            attachment.setName(file.getName());
            attachment.setByteArquivo(attachmentsService.getBytesFromFile(file));
            attachment.setTicket(ticket);
            attachmentsService.save(attachment);
            file.delete();
        }

        emails = emailService.getListEmailsToSend(olderTicket, ticket, null);
        if (emails.size() > 0) {
            if (olderTicket != null) {
                emailService.sendEmail(olderTicket, ticket, null,null,emails,Consts.TICKET_EDIT); //EDIT
            } else {
                emailService.sendEmail(ticket, null, null,null,emails,Consts.TICKET_NEW); //NEW
            }
        }
        return ticket;
    }

    public PageRequest getPageRequest(int limit, int start) {
        int pageSize = limit - start;
        int page;
        if (start == 0) {
            page = 0;
        } else {
            page = (limit / pageSize) - 1;
        }
        return new PageRequest(page, pageSize);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Entidade não encontrada")
    public void handleEntityNotFoundException(Exception ex) {
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public void handleDataIntegrityViolationException(DataIntegrityViolationException ex, HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_FORBIDDEN, ex.getMessage());
    }
}
