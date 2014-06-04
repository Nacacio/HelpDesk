package com.br.helpdesk.repository;

import com.br.helpdesk.model.TicketFile;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

/**
 * Created with IntelliJ IDEA.
 * User: rafaelpossas
 Date: 10/18/13
 Time: 3:09 PM
 To change this template use TicketFile | Settings | TicketFile Templates.
 */
public interface TicketFileRepository extends CrudRepository<TicketFile,Long> {
    List<TicketFile> findByNameContaining(String name);
}
