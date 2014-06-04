/*
* To change this license header, choose License Headers in Project Properties.
* To change this template file, choose Tools | Templates
* and open the template in the editor.
*/

package com.br.helpdesk.controller;
import com.br.helpdesk.model.Priority;
import com.br.helpdesk.service.PriorityService;
import java.io.IOException;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
@RequestMapping("/priority")
public class PriorityController {
    
    private PriorityService priorityService;
    
    public void setService(PriorityService service){
        this.priorityService = service;
    }
    
    @Autowired
    public PriorityController(PriorityService service){
        this.priorityService = service;
    }
    
    
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody Iterable<Priority> findAll() {
        return priorityService.findAll();
    }
    

    
    @RequestMapping(method = RequestMethod.GET, params={"name"})
    public @ResponseBody List<Priority> findByName(@RequestParam(value = "name") String name){
        List<Priority> priorityes = priorityService.findByNameContaining(name);
        return priorityes;
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody Priority findById(@PathVariable long id) throws EntityNotFoundException{
        Priority priority = priorityService.findById(id);
        if(priority == null){
             throw new EntityNotFoundException();
        }
        return priority;
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public @ResponseBody void delete(@PathVariable Long id) throws EntityNotFoundException,DataIntegrityViolationException{
        Priority priority = priorityService.findById(id);
        if(priority == null){
            throw new EntityNotFoundException();
        }
        try{
            priorityService.remove(priority);
        }
        catch(Exception e){
            throw new DataIntegrityViolationException("Entidade possui dependencias e não pode ser deletada");//DEPENDENCIAS
        }
    }
    @RequestMapping(value = {"", "/{id}"}, method = {RequestMethod.PUT, RequestMethod.POST})
    @ResponseBody
    public Priority save(@RequestBody Priority priority) {
        priority = priorityService.save(priority);
        return priority;
    }
    
    /**
     * Exceptions Handler
     */
    
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(value=HttpStatus.NOT_FOUND,reason = "Entidade não encontrada")
    public void handleEntityNotFoundException(Exception ex){}
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    public void handleDataIntegrityViolationException(DataIntegrityViolationException ex,HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_FORBIDDEN, ex.getMessage());
    }
}
