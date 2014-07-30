/*
* To change this license header, choose License Headers in Project Properties.
* To change this template file, choose Tools | Templates
* and open the template in the editor.
*/

package com.br.helpdesk.controller;
import com.br.helpdesk.model.Client;
import com.br.helpdesk.service.ClientService;
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
@RequestMapping("/client")
public class ClientController {
    
    private ClientService clientService;
    
    public void setService(ClientService service){
        this.clientService = service;
    }
    
    @Autowired
    public ClientController(ClientService service){
        this.clientService = service;
    }
    
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody Iterable<Client> findAll() {
        return clientService.findAll();
    }
    
    @RequestMapping(method = RequestMethod.GET, params={"name"})
    public @ResponseBody List<Client> findByName(@RequestParam(value = "name") String name){
        List<Client> clientes = clientService.findByNameContaining(name);
        if(clientes == null || clientes.isEmpty()){
            throw new EntityNotFoundException();
        }
        return clientes;
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody Client findById(@PathVariable long id) throws EntityNotFoundException{
        Client client = clientService.findById(id);
        if(client == null){
             throw new EntityNotFoundException();
        }
        return client;
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public @ResponseBody void delete(@PathVariable Long id) throws EntityNotFoundException,DataIntegrityViolationException{
        Client client = clientService.findById(id);
        if(client == null){
            throw new EntityNotFoundException();
        }
        try{
            clientService.remove(client);
        }
        catch(Exception e){
            throw new DataIntegrityViolationException("Entidade possui dependencias e não pode ser deletada");//DEPENDENCIAS
        }
    }
    @RequestMapping(value = {"", "/{id}"}, method = {RequestMethod.PUT, RequestMethod.POST})
    @ResponseBody
    public Client save(@RequestBody Client client) {
        client = clientService.save(client);
        return client;
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
