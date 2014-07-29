package com.br.helpdesk.integration;

import com.br.helpdesk.controller.UserController;
import com.br.helpdesk.model.Client;
import com.br.helpdesk.model.User;
import com.br.helpdesk.model.UserGroup;
import com.br.helpdesk.repository.ClientRepository;
import com.br.helpdesk.repository.UserGroupRepository;
import com.br.helpdesk.repository.UserRepository;
import com.br.helpdesk.service.ClientService;
import com.br.helpdesk.service.UserGroupService;
import com.br.helpdesk.service.UserService;
import com.br.helpdesk.util.TestUtil;
import com.github.springtestdbunit.DbUnitTestExecutionListener;
import com.github.springtestdbunit.annotation.DatabaseSetup;
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
import static org.hamcrest.Matchers.not;
import org.hamcrest.core.IsNull;
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
 * Created with IntelliJ IDEA. User: rafaelpossas Date: 10/18/13 Time: 3:20 PM
 * To change this template use File | Settings | File Templates.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/configuration/application.xml",
    "file:src/main/webapp/WEB-INF/configuration/database_test.xml", "file:src/main/webapp/WEB-INF/configuration/security.xml"})
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class,
    DirtiesContextTestExecutionListener.class,
    TransactionalTestExecutionListener.class,
    DbUnitTestExecutionListener.class})
@DatabaseSetup(value = "CompleteData.xml")
public class UserIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private UserService service;

    @Autowired
    private UserRepository repository;

    @Autowired
    private ClientService serviceClient;

    @Autowired
    private ClientRepository repositoryClient;

    @Autowired
    private UserGroupService serviceUserGroup;

    @Autowired
    private UserGroupRepository repositoryUserGroup;

    @InjectMocks
    private UserController controller;

    /**
     * @author Andre - Cria o servico e o repositorio reais, - Cria um mock do
     * controller
     */
    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        service.setRepository(repository);
        serviceClient.setRepository(repositoryClient);
        serviceUserGroup.setRepository(repositoryUserGroup);
        controller.setService(service);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    /**
     * @author Andre
     * @throws Exception
     */
    @Test
    public void testGetAllUsers() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/user"))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8
                .andReturn();// retorna um objeto de tipo MvcResult 

        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONArray jsonArray = new JSONArray(contentString);//transforma o JSON String para JsonArray

        assertThat(jsonArray.length(), is(5));
    }

    /**
     * @author Andre
     * @throws Exception
     */
    @Test
    public void testSaveUser() throws Exception {
        Client client = serviceClient.findById(1L);

        UserGroup userGroup = serviceUserGroup.findById(1L);

        User newUser = new User();
        newUser.setEmail("email");
        newUser.setIsEnabled(true);
        newUser.setName("New User");
        newUser.setPassword("pass");
        newUser.setUserName("login");
        newUser.setClient(client);
        newUser.setUserGroup(userGroup);

        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.put("/user")
                .content(TestUtil.convertObjectToJsonBytes(newUser))
                .contentType(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8
                .andReturn();// retorna um objeto de tipo MvcResult 

        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONObject jsonObject = new JSONObject(contentString);//transforma o JSON String para JsonArray

        assertThat(jsonObject.getInt("id"), is(6));
    }

    @Test
    public void testDeleteEntityNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/user/{id}", 50L))
                .andExpect(MockMvcResultMatchers.status().isNotFound());//verifica se o retorno é entityNotFound    
    }

    @Test
    public void testDeleteEntityDependency() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/user/{id}", 1L))
                .andExpect(MockMvcResultMatchers.status().isForbidden());//verifica se o retorno é forbidden    
    }

    @Test
    public void testDeleteEntity() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/user/{id}", 5L))
                .andExpect(MockMvcResultMatchers.status().isOk());//verifica se o retorno é entityNotFound    
    }

    /**
     * @author Andre
     * @throws Exception
     */
    @Test
    public void testGetByUserName() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/user/{username}", "user"))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8
                .andReturn();// retorna um objeto de tipo MvcResult 

        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONObject json = new JSONObject(contentString);//transforma o JSON String para JsonArray

        assertThat(json, is(not(IsNull.nullValue())));
        assertThat(json.getInt("id"), is(5));
    }

    @Test
    public void testGetById() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/user/id/{id}", "5"))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8
                .andReturn();// retorna um objeto de tipo MvcResult 

        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONObject json = new JSONObject(contentString);//transforma o JSON String para JsonArray

        assertThat(json, is(not(IsNull.nullValue())));
        assertThat(json.getInt("id"), is(5));
    }

    @Test
    public void testGetByEmail() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/user/email/{email}", "ricardo@gmail"))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8
                .andReturn();// retorna um objeto de tipo MvcResult 

        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONObject json = new JSONObject(contentString);//transforma o JSON String para JsonArray

        assertThat(json, is(not(IsNull.nullValue())));
        assertThat(json.getInt("id"), is(1));
    }

}
