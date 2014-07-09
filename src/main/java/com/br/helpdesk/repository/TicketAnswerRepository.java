/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.repository;

import com.br.helpdesk.model.TicketAnswer;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author ricardo
 */
public interface TicketAnswerRepository extends CrudRepository<TicketAnswer, Long> {

    @Query(
            "Select t FROM TicketAnswer t WHERE t.ticket.id = :ticketId "
    )
    public List<TicketAnswer> findAnswersByTicket(@Param("ticketId") Long ticketId);

    @Query(
            "Select t FROM TicketAnswer t WHERE t.ticket.id = :ticketId AND t.dateCreation = (SELECT MAX(t.dateCreation) FROM TicketAnswer)"
    )
    public TicketAnswer findLastAnswersByTicket(@Param("ticketId") Long ticketId);
}
