package com.br.helpdesk.repository;

import com.br.helpdesk.model.Attachments;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

/**
 * Created with IntelliJ IDEA.
 * User: rafaelpossas
 Date: 10/18/13
 Time: 3:09 PM
 To change this template use TicketFile | Settings | TicketFile Templates.
 */
public interface AttachmentsRepository extends CrudRepository<Attachments,Long> {
    List<Attachments> findByNameContaining(String name);
       
    @Query(
            "Select t FROM Attachments t WHERE t.ticket.id= :ticketId"
    )            
    List<Attachments> findByTicket(@Param("ticketId") Long ticketId);
    
}
