package com.br.helpdesk.repository;

import com.br.helpdesk.model.Category;
import org.springframework.data.repository.CrudRepository;

/**
 * Created with IntelliJ IDEA.
 * User: rafaelpossas
 * Date: 10/18/13
 * Time: 3:09 PM
 * To change this template use File | Settings | File Templates.
 */
public interface CategoryRepository extends CrudRepository<Category,Long> {
    Category findByNameContaining(String name);
}
