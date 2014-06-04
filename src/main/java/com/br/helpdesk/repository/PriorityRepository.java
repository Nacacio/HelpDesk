package com.br.helpdesk.repository;

import com.br.helpdesk.model.Priority;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

/**
 * Created with IntelliJ IDEA.
 * User: rafaelpossas
 * Date: 10/18/13
 * Time: 3:09 PM
 * To change this template use File | Settings | File Templates.
 */
public interface PriorityRepository extends CrudRepository<Priority,Long> {
    List<Priority> findByNameContaining(String name);
}
