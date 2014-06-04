/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.controller;

import com.br.helpdesk.model.Menu;
import com.br.helpdesk.repository.MenuRepository;
import java.util.List;
import javax.annotation.Resource;
import org.apache.commons.collections.IteratorUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author rafaelpossas
 */
@Controller
@RequestMapping("/menu")
public class MenuController {
    
    @Resource
    private MenuRepository menuRepository;
    
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody List<Menu> getAllMenus() {
        List<Menu> menus = null;
        menus = IteratorUtils.toList(menuRepository.findByMenu(null).iterator());
        return menus;
    }

}
