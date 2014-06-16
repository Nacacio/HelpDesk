/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.email;

/**
 *
 * @author Andre
 */

import java.io.IOException;
import java.util.Properties;
 
import javax.mail.Address;
import javax.mail.Flags;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Part;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.search.FlagTerm;
 
/**
* Class reads emails
*
* @author itcuties
*
*/
public class EmailReceiveTest {
 
   public static void main(String[] args) {
       readEmails(true);
   }
 
   /**
    * Method reads emails from the IMAP or POP3 server.
    * @param isImap - if true then we are reading messages from the IMAP server, if no then read from the POP3 server.
    */
   private static void readEmails(boolean isImap) {
       // Create all the needed properties - empty!
       Properties connectionProperties = new Properties();
       // Create the session
       Session session = Session.getDefaultInstance(connectionProperties,null);
        
       try {
           System.out.print("Connecting to the IMAP server...");
           // Connecting to the server
           // Set the store depending on the parameter flag value
           Store store = session.getStore("imaps");            
           // Set the server depending on the parameter flag value  
           
           //VALORES DO SERVIDOR 
           store.connect("imap.gmail.com","USERSERVIDOR","SENHASERVIDOR");            
           System.out.println("done!");
            
           // Get the Inbox folder
           Folder inbox = store.getFolder("Inbox");            
           // Set the mode to the read-write mode
           inbox.open(Folder.READ_ONLY);            
           
           // Get messages not seen
           FlagTerm ft = new FlagTerm(new Flags(Flags.Flag.SEEN), false);
           Message messages[] = inbox.search(ft);
            
           System.out.println("Reading messages...");
            
           // Display the messages
           for(Message message:messages) {  
               System.out.println("-------- E M A I L --------");
               System.out.println("Title: " + message.getSubject());
               System.out.println();
               Multipart mp = (Multipart)message.getContent();
                for (int i = 0, n = mp.getCount(); i < n; i++) {
                    handlePart(mp.getBodyPart(i));
                }
               System.out.println("---------------------------");
           }
            
       } catch (Exception e) {
           e.printStackTrace();
       }
        
   }
   
   public static void handlePart(Part part) throws MessagingException, IOException {

    String disposition = part.getDisposition();
    String contentType = part.getContentType();
    if (disposition == null) {// When just body
        // Check if plain
        if ((contentType.length() >= 10) && (contentType.toLowerCase().substring(0, 10).equals("text/plain"))) {
            part.writeTo(System.out);
        } else if ((contentType.length() >= 9)
                && (contentType.toLowerCase().substring(
                0, 9).equals("text/html"))) {
            part.writeTo(System.out);
        }else{
            part.writeTo(System.out);
        }
    } else if (disposition.equalsIgnoreCase(Part.ATTACHMENT)) {
        System.out.println("Attachment: " + part.getFileName()+ " : " + contentType);
    } else if (disposition.equalsIgnoreCase(Part.INLINE)) {
        System.out.println("Inline: " + part.getFileName()+ " : " + contentType);
    } else {
        System.out.println("Other: " + disposition);
    }
}
 
}