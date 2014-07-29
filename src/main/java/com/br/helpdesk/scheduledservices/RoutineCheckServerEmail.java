/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.scheduledservices;

import com.br.helpdesk.service.EmailService;
import javax.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class RoutineCheckServerEmail {

    @Autowired
    private EmailService emailService;

    @Scheduled(fixedDelay=(1000*60)*5)
    public void checkServerEmails() throws MessagingException {
        emailService.readEmails();
    }

}
