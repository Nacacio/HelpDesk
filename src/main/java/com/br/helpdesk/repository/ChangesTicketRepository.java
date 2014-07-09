/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.repository;

import com.br.helpdesk.model.ChangesTicket;
import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.User;
import java.util.Date;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author Sulivam
 */
public  interface ChangesTicketRepository extends CrudRepository<ChangesTicket,Long> {
    List<ChangesTicket> findByUser(User user);    
    List<ChangesTicket> findByTicket(Ticket ticket);
    
    @Query(
    "Select t FROM ChangesTicket t WHERE (t.dateCreation is not null) and (t.dateCreation between :date_1 and :date_2)"
    )
    public List<ChangesTicket> findBetweenDates(@Param("date_1") Date date_1, @Param("date_2") Date date_2);
}
