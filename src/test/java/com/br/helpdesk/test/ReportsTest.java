/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.test;

import com.br.helpdesk.repository.CategoryRepository;
import com.br.helpdesk.service.CategoryService;
import com.br.helpdesk.service.ReportsService;
import com.br.helpdesk.service.TicketService;
import com.br.helpdesk.service.UserService;
import javax.annotation.Resource;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author Sulivam
 */
public class ReportsTest {
    
//    @Autowired
//    private ReportsService reportsService;
//    
//    @Autowired
//    private UserService userService;
//    
//    @Autowired
//    private TicketService ticketService;
//    
//    @Autowired
//    private CategoryService categoryService;
//    
//    @Resource
//    private CategoryRepository repository;
//    
//    @Test
//    public void testReports() {
//        reportsService = new ReportsService();
//        userService = new UserService();
//        ticketService = new TicketService();
//        categoryService = new CategoryService();
//        categoryService.setRepository(repository);
//        
//        reportsService.setCategoryService(categoryService);
//        reportsService.setTicketService(ticketService);
//        reportsService.setUserService(userService);
//        String result = reportsService.getGridConsolidatedPerMonth("", null);
//        System.out.println("");
//    }
}
