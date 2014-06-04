/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.controller;


import com.br.helpdesk.email.EmailUtil;
import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.TicketAnswer;
import com.br.helpdesk.model.User;
import com.br.helpdesk.repository.TicketRepository;
import com.br.helpdesk.repository.UserRepository;
import com.br.helpdesk.service.TicketAnswerService;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 *
 * @author ricardo
 */

@Controller
@RequestMapping("/ticket-answer")
public class TicketAnswerController {
    
    
    private  TicketAnswerService answerService;
    
    public void setService(TicketAnswerService service){
        this.answerService = service;
    }
    
    @Autowired
    public TicketAnswerController(TicketAnswerService service){
        this.answerService = service;
    }
    
    @Resource
    private TicketRepository ticketRepository;
    
    @Resource
    private UserRepository userRepository;
    
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody Iterable<TicketAnswer> findAll() {        
        return answerService.findAll();
        
    }
    
    @RequestMapping(value = {"", "/{id}"}, method = {RequestMethod.PUT, RequestMethod.POST})
    @ResponseBody
    public TicketAnswer save(@RequestBody String ticketAnwString) throws ParseException {
        
        JSONObject jSONObject = new JSONObject(ticketAnwString);
        EmailUtil emailUtil = new EmailUtil();
        
        Ticket ticket = ticketRepository.findOne(jSONObject.getLong("ticketId"));          
        User user = userRepository.findOne(jSONObject.getLong("userId"));        
        
        TicketAnswer answer = new TicketAnswer();
        answer.setDescription(jSONObject.getString("description"));
        answer.setTicket(ticket);
        answer.setUser(user);
        answerService.save(answer);
        
        return answer;
    }
    
    @RequestMapping(value = "/find-by-ticket/{ticketId}" ,method = RequestMethod.GET)
    public @ResponseBody List<TicketAnswer> findAnswersByTicket(@PathVariable String ticketId){
        Ticket ticket = ticketRepository.findOne(Long.parseLong(ticketId));        
        return answerService.findAnswersByTicket(ticket);
    }
    
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(value=HttpStatus.NOT_FOUND,reason = "Entidade não encontrada")
    public void handleEntityNotFoundException(Exception ex){}
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    public void handleDataIntegrityViolationException(DataIntegrityViolationException ex,HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_FORBIDDEN, ex.getMessage());
    }
}
