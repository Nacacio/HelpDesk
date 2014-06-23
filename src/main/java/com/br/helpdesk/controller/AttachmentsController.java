/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.controller;

import com.br.helpdesk.model.Attachments;
import com.br.helpdesk.service.AttachmentsService;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;

@Controller
public class AttachmentsController {

    private AttachmentsService fileService;

    public void setService(AttachmentsService service) {
        this.fileService = service;
    }

    @Autowired
    public AttachmentsController(AttachmentsService service) {
        this.fileService = service;
    }

    public List<Attachments> findByName(String name) {
        List<Attachments> attachments = fileService.findByNameContaining(name);
        if (attachments == null || attachments.isEmpty()) {
            throw new EntityNotFoundException();
        }
        return attachments;
    }

    public Attachments findById(long id) throws EntityNotFoundException {
        Attachments attachment = fileService.findById(id);
        if (attachment == null) {
            throw new EntityNotFoundException();
        }
        return attachment;
    }

    public void delete(Long id) throws EntityNotFoundException, DataIntegrityViolationException {
        Attachments attachment = fileService.findById(id);
        if (attachment == null) {
            throw new EntityNotFoundException();
        }
        try {
            fileService.remove(attachment);
        } catch (Exception e) {
            throw new DataIntegrityViolationException("Entidade possui dependencias e não pode ser deletada");//DEPENDENCIAS
        }
    }

    public Attachments save(Attachments attachment) {
        return fileService.save(attachment);
    }
}
