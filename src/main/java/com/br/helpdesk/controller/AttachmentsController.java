/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.controller;

import com.br.helpdesk.model.Attachments;
import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.TicketAnswer;
import com.br.helpdesk.service.AttachmentsService;
import com.br.helpdesk.service.TicketAnswerService;
import com.br.helpdesk.service.TicketService;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@Controller
@RequestMapping("/attachments")
public class AttachmentsController {

    private AttachmentsService attachmentsService;

    public void setService(AttachmentsService service) {
        this.attachmentsService = service;
    }

    @Autowired
    public AttachmentsController(AttachmentsService service) {
        this.attachmentsService = service;
    }

    @Autowired
    private TicketService ticketService;

    public void setTicketService(TicketService service) {
        this.ticketService = service;
    }

    @Autowired
    private TicketAnswerService ticketAnswerService;

    public void setTicketAnswerService(TicketAnswerService service) {
        this.ticketAnswerService = service;
    }

    /**
     * upload
     */
    @RequestMapping(value = "/attachments", method = RequestMethod.POST)
    @ResponseBody
    public String uploadFile(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String username = request.getParameter("username");
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
        Collection<MultipartFile> filesCollection = multipartRequest.getFileMap().values();
        try {
            for (MultipartFile multipartFile : filesCollection) {
                String fileName = "##" + username + "##" + multipartFile.getOriginalFilename();
                attachmentsService.createFile(fileName, multipartFile.getBytes());
            }
        } catch (IOException e) {
            return "{success: false}";
        }
        return "{success: true}";
    }

    /**
     * download
     */
    @RequestMapping(value = "/attachments/{attachmentId}", method = RequestMethod.GET)
    @ResponseBody
    public void downloadFile(HttpServletRequest request, HttpServletResponse response, @PathVariable(value = "attachmentId") Long attachmentId) throws Exception {
        Attachments attachment = attachmentsService.findById(attachmentId);

        response.setContentType(attachment.getContentType());
        response.setContentLength(attachment.getByteArquivo().length);
        response.setHeader("Content-Disposition", "attachment; filename=\"" + attachment.getName() + "\"");

        FileCopyUtils.copy(attachment.getByteArquivo(), response.getOutputStream());
    }

    @RequestMapping(value = "/{ticketId}/attachments", method = RequestMethod.GET)
    @ResponseBody
    public String getFilesListFromTicket(HttpServletRequest request, HttpServletResponse response, @PathVariable(value = "ticketId") Long ticketId) throws Exception {
        Ticket ticket = ticketService.findById(ticketId);
        List<Attachments> listAllFiles = new ArrayList<Attachments>();
        List<Attachments> listFilesTicket = attachmentsService.findByTicket(ticketId);
        listAllFiles.addAll(listFilesTicket);
        List<Attachments> listFilesAnswers = new ArrayList<Attachments>();
        List<TicketAnswer> listAnswer = ticketAnswerService.findAnswersByTicket(ticket);
        for (TicketAnswer answer : listAnswer) {
            listFilesAnswers.addAll(attachmentsService.findByAnswer(answer.getId()));
        }
        listAllFiles.addAll(listFilesAnswers);
        String returnJson = attachmentsService.getListFilesJSON(listAllFiles);
        return returnJson;
    }

    public List<Attachments> findByName(String name) {
        List<Attachments> attachments = attachmentsService.findByNameContaining(name);
        if (attachments == null || attachments.isEmpty()) {
            throw new EntityNotFoundException();
        }
        return attachments;
    }

    public Attachments findById(long id) throws EntityNotFoundException {
        Attachments attachment = attachmentsService.findById(id);
        if (attachment == null) {
            throw new EntityNotFoundException();
        }
        return attachment;
    }

    public void delete(Long id) throws EntityNotFoundException, DataIntegrityViolationException {
        Attachments attachment = attachmentsService.findById(id);
        if (attachment == null) {
            throw new EntityNotFoundException();
        }
        try {
            attachmentsService.remove(attachment);
        } catch (Exception e) {
            throw new DataIntegrityViolationException("Entidade possui dependencias e não pode ser deletada");//DEPENDENCIAS
        }
    }

    public Attachments save(Attachments attachment) {
        return attachmentsService.save(attachment);
    }
}
