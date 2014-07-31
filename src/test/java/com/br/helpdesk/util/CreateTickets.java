/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.util;

import java.io.File;
import java.io.IOException;
import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;


import com.br.helpdesk.repository.*;
import com.br.helpdesk.model.*;
import com.br.helpdesk.service.*;
import com.github.springtestdbunit.DbUnitTestExecutionListener;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import javax.annotation.Resource;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.context.web.WebAppConfiguration;

import org.springframework.beans.factory.annotation.Autowired;

/**
 * Created with IntelliJ IDEA.
 * User: rafaelpossas
 * Date: 10/18/13
 * Time: 4:32 PM
 * To change this template use File | Settings | File Templates.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/configuration/application.xml",
        "file:src/main/webapp/WEB-INF/configuration/database_test.xml","file:src/main/webapp/WEB-INF/configuration/security.xml"})
@TestExecutionListeners({ DependencyInjectionTestExecutionListener.class,
        DirtiesContextTestExecutionListener.class,
        TransactionalTestExecutionListener.class,
        DbUnitTestExecutionListener.class })

/**
 *
 * @author Andre
 */
public class CreateTickets {
    
    @Autowired
    public CategoryService serviceCategory;
    
    @Autowired
    public ClientService serviceClient;
    
    @Autowired
    public PriorityService servicePriority;
        
    @Autowired
    public TicketService serviceTicket;
            
    @Autowired
    public UserGroupService serviceUserGroup;
                
    @Autowired
    public UserService serviceUser;
    
    @Resource
    public CategoryRepository repositoryCategory;
    
    @Resource
    public ClientRepository repositoryClient;
    
    @Resource
    public PriorityRepository repositoryPriority;
        
    @Resource
    public TicketRepository repositoryTicket;
            
    @Resource
    public UserGroupRepository repositoryUserGroup;
                
    @Resource
    public UserRepository repositoryUser;

    
    @Before
    public void setup() {
        serviceCategory.setRepository(repositoryCategory);
        serviceClient.setRepository(repositoryClient);
        servicePriority.setRepository(repositoryPriority);
        serviceTicket.setRepository(repositoryTicket);
        serviceUserGroup.setRepository(repositoryUserGroup);
        serviceUser.setRepository(repositoryUser);
    }
    
   @Test
    public void createTicketsFromXLS() throws BiffException, IOException, ParseException 
    {
        SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

        Workbook workbook = Workbook.getWorkbook(new File("C:\\Users\\Andre\\Desktop\\tickets.xls"));
        Sheet sheet = workbook.getSheet(0);
        int linhas = sheet.getRows();        

        for(int i = 1; i < linhas; i ++ )
        {

            String id = sheet.getCell(0, i).getContents();
            String assunto = sheet.getCell(1, i).getContents();
            String categoria = sheet.getCell(2, i).getContents();
            String data_abertura = sheet.getCell(3, i).getContents();
            String data_fechamento = sheet.getCell(4, i).getContents();
            //String prioridade = sheet.getCell(5, i).getContents();
            String usuario = sheet.getCell(6, i).getContents();
            String responsavel = sheet.getCell(7, i).getContents();
            String status = sheet.getCell(8, i).getContents();
            String passos = sheet.getCell(9, i).getContents(); 
            
            Long idLong = Long.parseLong(id);
            
            User user = serviceUser.findByName(usuario);
            if(user==null){
                user = serviceUser.findById(7L);//CYMO SUPPORT
            }
            
            User resp = serviceUser.findByName(responsavel);
            
            boolean isOpen = false;
            if(!status.equals("Fechado")){
                isOpen = true;
            }
            
            Date startDate = null;            
            if(!data_abertura.equals("")){
                startDate = formatter.parse(data_abertura);
            }
            
            Date endDate = null;            
            if(!data_fechamento.equals("")){
                endDate = formatter.parse(data_fechamento);
            }
            Category category;
            if(!categoria.equals("")){
                category = serviceCategory.findByNameContaining(categoria);
            }
            else{
                category = serviceCategory.findById(5L);//Sem Categoria
            }
            
                    
            Ticket ticket = new Ticket();
            ticket.setId(idLong);
            ticket.setCategory(category);
            ticket.setClient(user.getClient());
            ticket.setDescription(".");
            ticket.setEndDate(endDate);
            ticket.setIsOpen(isOpen);
            ticket.setResponsible(resp);
            ticket.setStartDate(startDate);
            ticket.setStepsTicket(passos);
            ticket.setTitle(assunto);
            ticket.setUser(user);
            
            serviceTicket.save(ticket);
            
            
        }

    }
}
