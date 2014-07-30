/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.controller;

import com.br.helpdesk.model.UserGroup;
import com.br.helpdesk.model.UserGroup;
import com.br.helpdesk.service.UserGroupService;
import java.io.IOException;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.collections.IteratorUtils;
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

/**
 *
 * @author rafaelpossas
 */
@Controller
@RequestMapping("/group")
public class UserGroupController {
    
    
    @Autowired
    private UserGroupService service;
    
    public void setService(UserGroupService service){
        this.service = service;
    }
    
    @Autowired
    public UserGroupController(UserGroupService service){
        this.service = service;
    }
    
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody Iterable<UserGroup> findAll() {
        return service.findAll();
    }
    
    @RequestMapping(method = RequestMethod.GET, params={"name"})
    public @ResponseBody List<UserGroup> findByName(@RequestParam(value = "name") String name){
        List<UserGroup> groups = service.findByNameContaining(name);
        if(groups == null || groups.isEmpty()){
            throw new EntityNotFoundException();
        }
        return groups;
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody UserGroup findById(@PathVariable long id) throws EntityNotFoundException{
        UserGroup group = service.findById(id);
        if(group == null){
             throw new EntityNotFoundException();
        }
        return group;
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public @ResponseBody void delete(@PathVariable Long id) throws EntityNotFoundException,DataIntegrityViolationException{
        UserGroup group = service.findById(id);
        if(group == null){
            throw new EntityNotFoundException();
        }
        try{
            service.remove(group);
        }
        catch(Exception e){
            throw new DataIntegrityViolationException("Entidade possui dependencias e não pode ser deletada");//DEPENDENCIAS
        }
    }
    @RequestMapping(value = {"", "/{id}"}, method = {RequestMethod.PUT, RequestMethod.POST})
    @ResponseBody
    public UserGroup save(@RequestBody UserGroup group) {
        return service.save(group);
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
