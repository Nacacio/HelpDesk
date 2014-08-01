/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.controller;

import com.Consts;
import com.br.helpdesk.model.User;
import com.br.helpdesk.service.UserService;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 *
 * @author rafaelpossas
 */
@Controller
@RequestMapping("/user")
public class UserController {

    private UserService userService;

    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody
    List<User> getAllUsers() {
        return IteratorUtils.toList(userService.findAll().iterator());
    }

    public void setService(UserService service) {
        this.userService = service;
    }

    @Autowired
    public UserController(UserService service) {
        this.userService = service;
    }

    @RequestMapping(value = "/{username}", method = RequestMethod.GET)
    public @ResponseBody
    User getByUserName(@PathVariable String username) {
        return userService.findByUserName(username);
    }

    @RequestMapping(value = {"", "/{id}"}, method = {RequestMethod.PUT, RequestMethod.POST})
    @ResponseBody
    public User save(@RequestBody User user) {        
        return userService.save(user);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public @ResponseBody
    void delete(@PathVariable Long id) throws EntityNotFoundException, DataIntegrityViolationException {
        User user = userService.findById(id);
        if (user == null) {
            throw new EntityNotFoundException();
        }
        try {
            userService.delete(user);
        } catch (Exception e) {
            throw new DataIntegrityViolationException(Consts.ENTITY_DEPENDECY);//DEPENDENCIAS
        }
    }

    @RequestMapping(value = "/admin", method = RequestMethod.GET)
    public @ResponseBody
    List<User> getByUserAdmin() {
        return userService.findByUserAdmin();
    }

    @RequestMapping(value = "/email/{email}", method = RequestMethod.GET)
    public @ResponseBody
    User getByEmail(@PathVariable String email) {
        return userService.findByEmail(email);
    }

    @RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
    public @ResponseBody
    User getById(@PathVariable long id) {
        return userService.findById(id);
    }

    /**
     * Exceptions Handler
     */
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Entidade não encontrada")
    public void handleEntityNotFoundException(Exception ex) {
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public void handleDataIntegrityViolationException(DataIntegrityViolationException ex, HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_FORBIDDEN, ex.getMessage());
    }

}
