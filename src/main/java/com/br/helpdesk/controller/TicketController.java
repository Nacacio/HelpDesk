package com.br.helpdesk.controller;

import com.br.helpdesk.model.TicketFile;
import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.User;
import com.br.helpdesk.service.TicketFileService;
import com.br.helpdesk.service.TicketService;
import com.br.helpdesk.service.UserService;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityNotFoundException;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@Controller
@RequestMapping("/ticket")
public class TicketController {
    
    @Autowired
    private TicketService ticketService;
    
    public void setService(TicketService service){
        this.ticketService = service;
    }
    
    @Autowired
    public TicketController(TicketService service){
        this.ticketService = service;
    }
    
    @Autowired
    private UserService userService;
    
    public void setUserService(UserService service){
        this.userService = service;
    }
    
    @Autowired
    private TicketFileService fileService;
    
    public void setFileService(TicketFileService service){
        this.fileService = service;
    }
    
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody List<Ticket> getAllTickets() {
        return ticketService.findAll();
    }
    
    @RequestMapping(value = "/all", method = RequestMethod.GET, params={"user"})
    public @ResponseBody List<Ticket> getAllTicketsByUser(@RequestParam(value = "user") String username) {
        User user = this.userService.findByUserName(username);
        if(user.getUserGroup().getId() == 1L){//SUPERUSER
            return ticketService.findAll();
        }
        else{
            return ticketService.findByUser(user);
        }
    }
    
    @RequestMapping(value = "/all-paging", method = RequestMethod.GET, params={"user","start", "limit"})
    public @ResponseBody List<Ticket> getAllTicketsByUserPaging(@RequestParam(value = "user") String username, @RequestParam int start, @RequestParam int limit) {
        User user = this.userService.findByUserName(username);
        
        int pageSize = limit - start;
        int page;
        if (start == 0) {
            page = 0;
        } else {
            page = (limit / pageSize) - 1;
        }
        PageRequest pageRequest = new PageRequest(page, pageSize);
        
        
        if(user.getUserGroup().getId() == 1L){//SUPERUSER
            return ticketService.findAll(pageRequest);
        }
        else{
            return ticketService.findByUserWithPaging(user,pageRequest);
        }  
    }
    
    
    @RequestMapping(value = "/paging",method = RequestMethod.GET, params = {"start", "limit"})
    public @ResponseBody
    List<Ticket> getTotalWithPaging(@RequestParam int start, @RequestParam int limit) {
        int pageSize = limit - start;
        int page;
        if (start == 0) {
            page = 0;
        } else {
            page = (limit / pageSize) - 1;
        }
        PageRequest pageRequest = new PageRequest(page, pageSize);
        return ticketService.findAll(pageRequest);
    }
    
    @RequestMapping(value = "/opened", method = RequestMethod.GET, params={"user","start", "limit"})
    public @ResponseBody List<Ticket> getTicketsOpenedByUser(@RequestParam(value = "user") String username,@RequestParam int start, @RequestParam int limit) {
        User user = this.userService.findByUserName(username);
        int pageSize = limit - start;
        int page;
        if (start == 0) {
            page = 0;
        } else {
            page = (limit / pageSize) - 1;
        }
        PageRequest pageRequest = new PageRequest(page, pageSize);
        
        if(user.getUserGroup().getId() == 1L){//SUPERUSER
            return ticketService.findByIsOpenWithPaging(true,pageRequest);
        }
        else{
            return ticketService.findByIsOpenAndUser(true,user);
        }
    }
    
    @RequestMapping(value = "/closed", method = RequestMethod.GET, params={"user"})
    public @ResponseBody List<Ticket> getTicketsClosedByUser(@RequestParam(value = "user") String username) {
        User user = this.userService.findByUserName(username);
        if(user.getUserGroup().getId() == 1L){//SUPERUSER
            return ticketService.findByIsOpen(false);
        }
        else{
            return ticketService.findByIsOpenAndUser(false,user);
        }
    }
    
    @RequestMapping(value = "/mytickets", method = RequestMethod.GET, params={"user","start", "limit"})
    public @ResponseBody List<Ticket> getMyTickets(@RequestParam(value = "user") String username,@RequestParam int start, @RequestParam int limit) {
        User user = this.userService.findByUserName(username);
        int pageSize = limit - start;
        int page;
        if (start == 0) {
            page = 0;
        } else {
            page = (limit / pageSize) - 1;
        }
        PageRequest pageRequest = new PageRequest(page, pageSize);
        return ticketService.findByResponsavelWithPaging(user,pageRequest);
    }
    
    @RequestMapping(value = "/withoutresponsible", method = RequestMethod.GET, params={"user","start","limit"})
    public @ResponseBody List<Ticket> getTicketsWithoutResponsible(@RequestParam(value = "user") String username,@RequestParam int start, @RequestParam int limit) {
        int pageSize = limit - start;
        int page;
        if (start == 0) {
            page = 0;
        } else {
            page = (limit / pageSize) - 1;
        }
        PageRequest pageRequest = new PageRequest(page, pageSize);
        return ticketService.findByResponsavelWithPaging(null,pageRequest);
    }
    
    @RequestMapping(value = "/textmenu", method = RequestMethod.GET, params={"user"}, produces="application/json;charset=UTF-8")
    public @ResponseBody String getTextMenu(@RequestParam(value = "user") String username, HttpServletResponse response) throws UnsupportedEncodingException {
        User user = this.userService.findByUserName(username);
        int todos,abertos,fechados,withoutresponsible,mytickets;
        if(user.getUserGroup().getId() == 1L){//SUPERUSER
            todos = ticketService.findAll().size();
            abertos = ticketService.findByIsOpen(true).size();
            fechados = ticketService.findByIsOpen(false).size();
            mytickets = ticketService.findByResponsavel(user).size();
            withoutresponsible = ticketService.findByResponsavel(null).size();
        }
        else{
            todos = ticketService.findByUser(user).size();
            abertos = ticketService.findByIsOpenAndUser(true, user).size();
            fechados = ticketService.findByIsOpenAndUser(false, user).size();
            mytickets = 0;
            withoutresponsible = 0;
        }
        return "{\"todos\":'" +todos+"', \"abertos\": '"+abertos+"', \"fechados\": '"+fechados+"', \"mytickets\": '"+mytickets+"', \"withoutresponsible\": '"+withoutresponsible+"'}";
    }
    
    @RequestMapping(value = {"", "/{id}"}, method = {RequestMethod.POST,RequestMethod.PUT})
    @ResponseBody
    public Ticket save(@RequestBody Ticket ticket) {
//        if(ticket.getId() == null){
//            EmailUtil eu = new EmailUtil();
//            eu.novoTicket(ticket.getTitle(), ticket.getCategory().getName(), ticket.getDescription(), ticket.getPassosParaReproducao());
//        }
        return ticketService.save(ticket);
    }
    
    @RequestMapping(value = {"/uploadfiles"},method = {RequestMethod.POST})
    @ResponseBody
    public String uploadImages(MultipartHttpServletRequest request, HttpServletResponse response) throws IOException {
        Long ticketId = Long.parseLong(request.getParameter("ticketId"));
        Ticket ticket = ticketService.findById(ticketId);
        Collection<MultipartFile> filesCollection = request.getFileMap().values();
        TicketFile file;
        try{
            for (MultipartFile multipartFile : filesCollection) {
                file = new TicketFile();
                file.setName(multipartFile.getOriginalFilename());
                file.setByteArquivo(multipartFile.getBytes());
                file.setTicket(ticket);
                fileService.save(file);            
            }
        }
        catch (IOException e){
            return "{success: false}";
        }
        
        return "{success: true}";
    }
    
    @RequestMapping(value = "/downloadfiles", method = RequestMethod.POST, params={"idFile"})
    @ResponseBody
    public void downloadFile(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "idFile") Long idFile) throws Exception {
//        TicketFile ticketFile = fileService.findById(idFile);
//
//        response.setHeader("Content-Disposition", "attachment; filename=\"" +ticketFile.getName());
//        response.getOutputStream().write(ticketFile.getByteArquivo());
//        response.flushBuffer();
        
        String retorno = fileService.createFile(idFile, request.getServletContext());
        System.out.print(retorno);
    }
    
    
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(value=HttpStatus.NOT_FOUND,reason = "Entidade não encontrada")
    public void handleEntityNotFoundException(Exception ex){}
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    public void handleDataIntegrityViolationException(DataIntegrityViolationException ex,HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_FORBIDDEN, ex.getMessage());
    }
}
