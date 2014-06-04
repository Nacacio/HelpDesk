/*
* To change this license header, choose License Headers in Project Properties.
* To change this template file, choose Tools | Templates
* and open the template in the editor.
*/

package com.br.helpdesk.controller;
import com.br.helpdesk.model.TicketFile;
import com.br.helpdesk.service.TicketFileService;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
public class TicketFileController {
    
    private TicketFileService fileService;
    
    public void setService(TicketFileService service){
        this.fileService = service;
    }
    
    @Autowired
    public TicketFileController(TicketFileService service){
        this.fileService = service;
    }
        
    public List<TicketFile> findByName(String name){
        List<TicketFile> filees = fileService.findByNameContaining(name);
        if(filees == null || filees.isEmpty()){
            throw new EntityNotFoundException();
        }
        return filees;
    }
    
    public TicketFile findById(long id) throws EntityNotFoundException{
        TicketFile file = fileService.findById(id);
        if(file == null){
             throw new EntityNotFoundException();
        }
        return file;
    }
    
    public void delete(Long id) throws EntityNotFoundException,DataIntegrityViolationException{
        TicketFile file = fileService.findById(id);
        if(file == null){
            throw new EntityNotFoundException();
        }
        try{
            fileService.remove(file);
        }
        catch(Exception e){
            throw new DataIntegrityViolationException("Entidade possui dependencias e não pode ser deletada");//DEPENDENCIAS
        }
    }

    public TicketFile save(TicketFile file) {
        return fileService.save(file);
    }
}
