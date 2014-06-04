/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.repository;

import com.br.helpdesk.model.Menu;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

/**
 *
 * @author rafaelpossas
 */
public interface MenuRepository extends CrudRepository<Menu, Long> {
    List<Menu> findByMenu(Menu menu);
    
}
