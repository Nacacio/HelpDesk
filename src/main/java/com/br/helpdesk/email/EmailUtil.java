/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.email;

import com.br.helpdesk.model.ConfigEmail;
import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.TicketAnswer;
import com.br.helpdesk.model.User;
import com.br.helpdesk.service.ConfigEmailService;
import java.io.IOException;
import java.util.List;
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
public class EmailUtil {

    public static String IMAPS = "imaps";
    public static String IMAP_GMAIL = "imap.gmail.com";
    public static String USER = "andresulivam@gmail.com";//Alterar AQUI
    public static String PASSWORD = "26240241";//Alterar AQUI
    public static String FOLDER = "Inbox";
    public static String SMTP_GMAIL = "smtp.gmail.com";
    public static String PORT_GMAIL = "465";

    public static String SEND_FROM = "andresulivam@gmail.com";//Alterar AQUI
    public static String SEND_TO = "andresulivam@gmail.com";//Alterar AQUI    

    public static Properties PROPERTIES;

    //@Autowired
    //private ConfigEmailService configEmailService;
    //private ConfigEmail configEmail;
    public EmailUtil() {
        //configEmailService = new ConfigEmailService();
        //configEmail = configEmailService.findById(1L);
        //if (configEmail != null) {
        PROPERTIES = new Properties();
        PROPERTIES.put("mail.smtp.host", SMTP_GMAIL);
        PROPERTIES.put("mail.smtp.socketFactory.port", PORT_GMAIL);
        PROPERTIES.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        PROPERTIES.put("mail.smtp.auth", "true");
        PROPERTIES.put("mail.smtp.port", PORT_GMAIL);
        // }

    }

    public void getEmailsNaoLidos() throws IOException, Exception {
        // Create all the needed properties - empty!
        Properties connectionProperties = new Properties();
        // Create the session
        Session session = Session.getDefaultInstance(connectionProperties, null);
        try {
            Store store = session.getStore(IMAPS);
            // Set the server depending on the parameter flag value           
            store.connect(IMAP_GMAIL, USER, PASSWORD);

            // Get the Inbox folder
            Folder inbox = store.getFolder(FOLDER);

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

    public void sendEmail(String title, String categoria, String observacoes, String passos) {
        Session session = Session.getDefaultInstance(PROPERTIES, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(USER, PASSWORD);
            }
        });
        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(SEND_FROM));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(SEND_TO));
            message.setSubject(title);
            message.setContent(contentNewTicket(title, categoria, observacoes, passos), "text/html; charset=utf-8");
            Transport.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendEmailNewTicket(Ticket ticket, List<String> listEmailsTo) {
        Session session = Session.getDefaultInstance(PROPERTIES, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(USER, PASSWORD);
            }
        });
        for (String email : listEmailsTo) {
            try {
                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress(SEND_FROM));
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
                message.setSubject(ticket.getTitle());
                message.setContent(contentNewTicket(ticket.getTitle(), ticket.getCategory().getName(), ticket.getDescription(), ticket.getStepsTicket()), "text/html; charset=utf-8");
                Transport.send(message);

            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public void sendEmailEditTicket(Ticket olderTicket, Ticket newTicket, List<String> listEmailsTo) {
        Session session = Session.getDefaultInstance(PROPERTIES, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(USER, PASSWORD);
            }
        });
        for (String email : listEmailsTo) {
            try {
                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress(SEND_FROM));
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
                message.setSubject(olderTicket.getTitle());
                message.setContent(contentEditTicket(olderTicket, newTicket), "text/html; charset=utf-8");
                Transport.send(message);

            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public void sendEmailNewAnswer(TicketAnswer answer, User userAnswer, List<String> listEmailsTo) {
        Session session = Session.getDefaultInstance(PROPERTIES, new javax.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(USER, PASSWORD);
            }
        });
        for (String email : listEmailsTo) {
            try {
                Message message = new MimeMessage(session);
                message.setFrom(new InternetAddress(SEND_FROM));
                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
                message.setSubject(answer.getTicket().getTitle());
                message.setContent(contentNewAnswer(answer.getDescription(), userAnswer.getName()), "text/html; charset=utf-8");
                Transport.send(message);

            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
        }
    }

    private String contentNewTicket(String assunto, String categoria, String observacoes, String passos) {
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
                + "<h3> Novo Ticket Criado </h3>"
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

    private String contentEditTicket(Ticket olderTicket, Ticket newTicket) {
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
                + "<h3> Novo Ticket Criado </h3>"
                + "<table>"
                + "<tr>"
                + "<th><h2>CATEGORIA ANTIGA:&nbsp;</h2></th>"
                + "<th><pre>" + olderTicket.getCategoryName() + "</pre></th>"
                + "<th><h2>CATEGORIA NOVA:&nbsp;</h2></th>"
                + "<th><pre>" + newTicket.getCategoryName() + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<table>"
                + "<tr>"
                + "<th><h2>PRAZO ANTIGO:&nbsp;</h2></th>"
                + "<th><pre>" + olderTicket.getEstimateTime() + "</pre></th>"
                + "<th><h2>PRAZO NOVO:&nbsp;</h2></th>"
                + "<th><pre>" + newTicket.getEstimateTime() + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<br>"
                + "<HR>"
                + "<br>"
                + "<th><h2>PRIORIDADE ANTIGA:&nbsp;</h2></th>"
                + "<th><pre>" + olderTicket.getPriorityName() + "</pre></th>"
                + "<th><h2>PRIORIDADE NOVA:&nbsp;</h2></th>"
                + "<th><pre>" + newTicket.getPriorityName() + "</pre></th>"
                + "<br>"
                + "<HR>"
                + "<br>"
                + "<th><h2>PRIORIDADE ANTIGA:&nbsp;</h2></th>"
                + "<th><pre>" + olderTicket.getResponsibleName() + "</pre></th>"
                + "<th><h2>PRIORIDADE NOVA:&nbsp;</h2></th>"
                + "<th><pre>" + newTicket.getResponsibleName() + "</pre></th>"
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

    private String contentNewAnswer(String description, String userName) {
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
                + "<h3> Nova Resposta Criada</h3>"
                + "<table>"
                + "<tr>"
                + "<th><h2>CRIADA POR:&nbsp;</h2></th>"
                + "<th><pre>" + userName + "</pre></th>"
                + "</tr>"
                + "</table>"
                + "<table>"
                + "<tr>"
                + "<th><h2>RESPOSTA:&nbsp;</h2></th>"
                + "<th><pre>" + description + "</pre></th>"
                + "</tr>"
                + "</table>"
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
}
