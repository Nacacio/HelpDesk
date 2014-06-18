/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.service;

import com.br.helpdesk.model.ConfigEmail;
import java.io.IOException;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.mail.Flags;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Part;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.search.FlagTerm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Andre
 */
@Service
public class EmailService {
    public static int EMAIL_NEW_TICKET = 0;
    public static int EMAIL_NEW_ANSWER = 1;
    public static int EMAIL_CHANGES = 2;
    public static String SEND_FROM = "andresulivam@gmail.com";//Alterar AQUI
    public static String SEND_TO = "andresulivam@gmail.com";//Alterar AQUI    

    public static Properties PROPERTIES;

    @Autowired
    private ConfigEmailService configEmailService;

    private ConfigEmail configEmail;
    
    public void getEmailsNaoLidos() throws IOException, Exception {
        // Create all the needed properties - empty!
        Properties connectionProperties = new Properties();
        // Create the session
        Session session = Session.getDefaultInstance(connectionProperties, null);
        try {
            Store store = session.getStore(configEmail.getImaps());
            // Set the server depending on the parameter flag value           
            store.connect(configEmail.getImap(), configEmail.getUser(), configEmail.getPassword());

            // Get the Inbox folder
            Folder inbox = store.getFolder(configEmail.getFolder());

           //READ_ONLY - Apenas le
            //READ_WRITE- Le e marca como lido
            inbox.open(Folder.READ_ONLY);

            // Get messages not seen
            FlagTerm ft = new FlagTerm(new Flags(Flags.Flag.SEEN), false);
            Message messages[] = inbox.search(ft);

            // Display the messages
            for (Message message : messages) {
                System.out.println("\n-------- E M A I L --------");
                System.out.println("\nTitle: " + message.getSubject());
                getIdTicketFromTitle(message.getSubject());
                System.out.println("\n-- C O N T E N T --");
                if (message.getContent() instanceof MimeMultipart) {
                    System.out.println("\n" + ((MimeMultipart) message.getContent()).getBodyPart(0).getContent());
                } else {
                    System.out.println("\n" + message.getContent());
                }
                System.out.println("-------------------");
                System.out.println("\n---------------------------");
            }

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendEmail(String title, String categoria, String observacoes, String passos, int emailType) {
        Session session = getSession();

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(SEND_FROM));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(SEND_TO));
            
            if(emailType == EMAIL_NEW_TICKET){
                message = emailNewTicket(message,title,categoria,observacoes,passos);
            }
            else if(emailType == EMAIL_NEW_ANSWER){
                
            }
            else if(emailType == EMAIL_CHANGES){
                
            }
            
            Transport.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
    
    public Message emailNewTicket(Message message, String title, String categoria, String observacoes, String passos) throws MessagingException{
        message.setSubject(title);
        message.setContent(contentNovoTicket(title, categoria, observacoes, passos), "text/html; charset=utf-8");        
        return message;
    }
    private String contentNovoTicket(String assunto, String categoria, String observacoes, String passos) {
        String html = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='UTF-8\'>"
                + "<style>"
                + "h2{color:blue;font-size: 16px;font-weight: bold;}"
                + "pre{color:black;font-size: 15px;font-weight: normal;}"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<table>"
                + "<tr>"
                + "<th><h2>ASSUNTO:&nbsp;</h2></th>"
                + "<th><pre>" + assunto + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<table>"
                + "<tr>"
                + "<th><h2>CATEGORIA:&nbsp;</h2></th>"
                + "<th><pre>" + categoria + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<br>"
                + "<HR>"
                + "<br>"
                + "<h2>PASSOS PARA REPRODUZIR:</h2>"
                + "<pre>" + passos + "</pre>"
                + "<br>"
                + "<HR>"
                + "<br>"
                + "<h2>OBSERVAÇÕES:</h2>"
                + "<pre>" + observacoes + "</pre>"
                + "<br>"
                + "<HR>"
                + "<br>"
                + "<h4>"
                + "Cymo Tecnologia em Gestão"
                + "</h4>"
                + "<pre>"
                + "Atenção: esta é uma mensagem automática. Para responder ou consultar o histórico deste atendimento, acesse:"
                + "<pre>"
                + "</body>"
                + "</html>";
        return html;
    }

    /**
     * Return the primary text content of the message.
     */
    private String getText(Part p) throws
            MessagingException, IOException {
        boolean textIsHtml = false;
        if (p.isMimeType("text/*")) {
            String s = (String) p.getContent();
            textIsHtml = p.isMimeType("text/html");
            return s;
        }

        if (p.isMimeType("multipart/alternative")) {
            // prefer html text over plain text
            Multipart mp = (Multipart) p.getContent();
            String text = null;
            for (int i = 0; i < mp.getCount(); i++) {
                Part bp = mp.getBodyPart(i);
                if (bp.isMimeType("text/plain")) {
                    if (text == null) {
                        text = getText(bp);
                    }
                    continue;
                } else if (bp.isMimeType("text/html")) {
                    String s = getText(bp);
                    if (s != null) {
                        return s;
                    }
                } else {
                    return getText(bp);
                }
            }
            return text;
        } else if (p.isMimeType("multipart/*")) {
            Multipart mp = (Multipart) p.getContent();
            for (int i = 0; i < mp.getCount(); i++) {
                String s = getText(mp.getBodyPart(i));
                if (s != null) {
                    return s;
                }
            }
        }

        return null;
    }

    /**
     * Retorna o ID do ticket de acordo com a String no padrão ..... #09123#
     * .....
     *
     * @param titulo
     * @return
     */
    private int getIdTicketFromTitle(String titulo) {
        int id = 0;
        Pattern pattern = Pattern.compile("#(.*?)#");
        Matcher matcher = pattern.matcher(titulo);
        if (matcher.find()) {
            String idString = matcher.group(1);
            id = Integer.parseInt(idString);
        }
        return id;
    }
    
    private Session getSession(){
        if(configEmailService != null){
            configEmail = configEmailService.findById(1L);
            if (configEmail != null) {
                PROPERTIES = new Properties();
                PROPERTIES.put("mail.smtp.host", configEmail.getSmtp());
                PROPERTIES.put("mail.smtp.socketFactory.port", configEmail.getPort());
                PROPERTIES.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
                PROPERTIES.put("mail.smtp.auth", "true");
                PROPERTIES.put("mail.smtp.port", configEmail.getPort());
            }
        }
        
        Session session = Session.getDefaultInstance(PROPERTIES, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(configEmail.getUser(), configEmail.getPassword());
            }
        });        
        return session;
    }
}
