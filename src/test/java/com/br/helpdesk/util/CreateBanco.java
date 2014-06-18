package com.br.helpdesk.util;

import com.br.helpdesk.repository.*;
import com.br.helpdesk.model.*;
import com.br.helpdesk.service.*;
import com.github.springtestdbunit.DbUnitTestExecutionListener;
import java.util.Date;
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
public class CreateBanco {

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
    public void createBanco(){
        
        Long i;
        Category category;
        Client client;
        Priority priority;
        Ticket ticket;
        UserGroup userGroup;
        User user;
        //CRIAR ENTIDADES BASICAS
        for (i = 1L; i < 6L; i++) {            
            category = new Category();
            category.setName("Category [" + i +"]");
            serviceCategory.save(category);
            client = new Client();
            client.setName("Client [" + i +"]");
            serviceClient.save(client);
            priority = new Priority();
            priority.setName("Priority [" + i +"]");
            servicePriority.save(priority);
            userGroup = new UserGroup();
            userGroup.setName("User Group ["+ i +"]");
            serviceUserGroup.save(userGroup);
        }
        //CRIAR USUARIOS
        for (i = 1L; i < 6L; i++) {
            client = serviceClient.findById(i);
            userGroup = serviceUserGroup.findById(i);
            user = new User();
            user.setEmail("email_"+i+"@cymo.com.br");
            user.setName("Name ["+ i +"]");
            user.setIsEnabled(Boolean.TRUE);
            user.setPassword("11"+i);
            user.setUserName("11"+i);            
            user.setClient(client);
            user.setUserGroup(userGroup);
            serviceUser.save(user);
        }
        //CRIAR TICKETS
         for (i = 1L; i < 6L; i++) {
            user = serviceUser.findById(i);
            client = serviceClient.findById(i);
            category = serviceCategory.findById(i);
            priority = servicePriority.findById(i);
            ticket = new Ticket();
            ticket.setCategory(category);
            ticket.setClient(client);
            ticket.setDescription("Description ["+ i +"]");
            ticket.setEndDate(null);
            ticket.setEstimateTime(null);
            ticket.setIsOpen(Boolean.TRUE);
            ticket.setStepsTicket("Passos para reprodução ["+ i +"]");
            ticket.setPriority(priority);
            ticket.setResponsible(null);
            ticket.setStartDate(new Date());
            ticket.setUser(user);
            ticket.setTitle("Title ["+ i +"]");
            
            serviceTicket.save(ticket);
        }
     }
}
