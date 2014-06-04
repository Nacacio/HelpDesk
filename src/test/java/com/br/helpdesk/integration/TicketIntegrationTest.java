package com.br.helpdesk.integration;

import com.br.helpdesk.controller.TicketController;
import com.br.helpdesk.model.*;
import com.br.helpdesk.repository.CategoryRepository;
import com.br.helpdesk.repository.ClientRepository;
import com.br.helpdesk.repository.TicketRepository;
import com.br.helpdesk.repository.UserRepository;
import com.br.helpdesk.service.CategoryService;
import com.br.helpdesk.service.ClientService;
import com.br.helpdesk.service.TicketService;
import com.br.helpdesk.service.UserService;
import com.br.helpdesk.util.TestUtil;
import com.github.springtestdbunit.DbUnitTestExecutionListener;
import com.github.springtestdbunit.annotation.DatabaseSetup;
import java.util.Date;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.context.web.WebAppConfiguration;

import static org.hamcrest.Matchers.is;
import org.json.JSONArray;
import org.json.JSONObject;
import static org.junit.Assert.assertThat;
import org.junit.Before;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

/**
 * Created with IntelliJ IDEA.
 * User: rafaelpossas
 * Date: 10/18/13
 * Time: 3:20 PM
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
@DatabaseSetup(value="CompleteData.xml")
public class TicketIntegrationTest {
    
    private MockMvc mockMvc;
    
    @Autowired
    private TicketRepository repository;
    
    @Autowired
    private TicketService service;
    
    @Autowired
    private CategoryService serviceCategory;
        
    @Autowired
    private ClientService serviceClient;
        
    @Autowired
    private CategoryRepository repositoryCategory;
        
    @Autowired
    private ClientRepository repositoryClient;
        
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;
        
    @InjectMocks
    private TicketController controller;
    
    
    /**
     * @author Andre
     * - Cria o servico e o repositorio reais,
     * - Cria um mock do controller
     */
    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        serviceClient.setRepository(repositoryClient);
        serviceCategory.setRepository(repositoryCategory);
        userService.setRepository(userRepository);
        service.setRepository(repository);
        controller.setService(service);
        controller.setUserService(userService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }
    
    /**
     * @author Andre
     * @throws Exception
     */
    @Test
    public void testFindAll() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/ticket"))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8
                .andReturn();// retorna um objeto de tipo MvcResult 
        
        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONArray jsonArray = new JSONArray(contentString);//transforma o JSON String para JsonArray
        
        assertThat(jsonArray.length(), is(5));// verifica se a quantidade de objetos retornados � igual a 2, isso varia de acordo com a configura��o do "ClientData.xml"
    }
    
     /**
     * @author Andre
     * @throws Exception
     */
    @Test
    public void testGetTicketsOpenedByUserWithSuperuser() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/ticket/opened").param("user", "andrenacacio"))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8
                .andReturn();// retorna um objeto de tipo MvcResult 
        
        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONArray jsonArray = new JSONArray(contentString);//transforma o JSON String para JsonArray
        
        assertThat(jsonArray.length(), is(5));// verifica se a quantidade de objetos retornados � igual a 2, isso varia de acordo com a configura��o do "ClientData.xml"
    }
    
    /**
     * @author Andre
     * @throws Exception
     */
    @Test
    public void testGetTicketsOpenedByUser() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/ticket/opened").param("user", "user"))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8
                .andReturn();// retorna um objeto de tipo MvcResult 
        
        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONArray jsonArray = new JSONArray(contentString);//transforma o JSON String para JsonArray
        
        assertThat(jsonArray.length(), is(0));// verifica se a quantidade de objetos retornados � igual a 2, isso varia de acordo com a configura��o do "ClientData.xml"
    }
    
     /**
     * @author Andre
     * @throws Exception
     */
    @Test
    public void testGetTicketsClosedByUser() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/ticket/closed").param("user", "user"))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8
                .andReturn();// retorna um objeto de tipo MvcResult 
        
        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONArray jsonArray = new JSONArray(contentString);//transforma o JSON String para JsonArray
        
        assertThat(jsonArray.length(), is(0));// verifica se a quantidade de objetos retornados � igual a 2, isso varia de acordo com a configura��o do "ClientData.xml"
    }
    /**
     * @author Andre
     * @throws Exception
     */
    @Test
    public void testGetTicketsClosedByUserWithSuperuser() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/ticket/closed").param("user", "andrenacacio"))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8
                .andReturn();// retorna um objeto de tipo MvcResult 
        
        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONArray jsonArray = new JSONArray(contentString);//transforma o JSON String para JsonArray
        
        assertThat(jsonArray.length(), is(0));// verifica se a quantidade de objetos retornados � igual a 2, isso varia de acordo com a configura��o do "ClientData.xml"
    }
    
     /**
     * @author Andre
     * @throws Exception
     */
    @Test
    public void testGetAllTicketsByUser() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/ticket/all").param("user", "user"))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8
                .andReturn();// retorna um objeto de tipo MvcResult 
        
        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONArray jsonArray = new JSONArray(contentString);//transforma o JSON String para JsonArray
        
        assertThat(jsonArray.length(), is(0));// verifica se a quantidade de objetos retornados � igual a 2, isso varia de acordo com a configura��o do "ClientData.xml"
    }
    
     /**
     * @author Andre
     * @throws Exception
     */
    @Test
    public void testGetAllTicketsByUserWithSuperuser() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/ticket/all").param("user", "andrenacacio"))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na
                .andReturn();// retorna um objeto de tipo MvcResult 
        
        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONArray jsonArray = new JSONArray(contentString);//transforma o JSON String para JsonArray
        
        assertThat(jsonArray.length(), is(5));// verifica se a quantidade de objetos retornados � igual a 2, isso varia de acordo com a configura��o do "ClientData.xml"
    }
    
        
     /**
     * @author Andre
     * @throws Exception
     */
    @Test
    public void testGetTextMenuWithSuperuser() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/ticket/textmenu").param("user", "andrenacacio"))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8
                .andReturn();// retorna um objeto de tipo MvcResult 
        
        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONObject jsonObject = new JSONObject(contentString);//transforma o JSON String para JsonArray
        
        assertThat(jsonObject.getInt("todos"), is(5));
        assertThat(jsonObject.getInt("abertos"), is(5));
        assertThat(jsonObject.getInt("fechados"), is(0));
        assertThat(jsonObject.getInt("mytickets"), is(0));
        assertThat(jsonObject.getInt("withoutresponsible"), is(0));
    }
    
    /**
     * @author Andre
     * @throws Exception
     */
    @Test
    public void testGetTextMenu() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/ticket/textmenu").param("user", "user"))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8
                .andReturn();// retorna um objeto de tipo MvcResult 
        
        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONObject jsonObject = new JSONObject(contentString);//transforma o JSON String para JsonArray
        
        assertThat(jsonObject.getInt("todos"), is(0));
        assertThat(jsonObject.getInt("abertos"), is(0));
        assertThat(jsonObject.getInt("fechados"), is(0));
        assertThat(jsonObject.getInt("mytickets"), is(0));
        assertThat(jsonObject.getInt("withoutresponsible"), is(0));
    }
    
    @Test
    public void testeSaveTicket() throws Exception{
        Category category = serviceCategory.findById(1L);
                
        Client client = serviceClient.findById(1L);
        
        User user = userService.findById(1L);
        
        Ticket newTicket = new Ticket();
        
        newTicket.setCategory(category);
        newTicket.setClient(client);
        newTicket.setUser(user);
        
        newTicket.setPassosParaReproducao("Passos para Reprodução");
        newTicket.setDescription("Description");
        newTicket.setTitle("Assunto");
        
        newTicket.setIsOpen(true);        
        
        newTicket.setStartDate(new Date());
        
        newTicket.setPriority(null);        
        newTicket.setEstimateTime(null);
        newTicket.setEndDate(null);
        newTicket.setResponsavel(null);
        
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.post("/ticket")
                .content(TestUtil.convertObjectToJsonBytes(newTicket))
                .contentType(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8
                .andReturn();// retorna um objeto de tipo MvcResult
        
        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONObject jsonObject = new JSONObject(contentString);//transforma o JSON String para JsonArray
        
        assertThat(jsonObject.getInt("id"), is(6));
    }
}
