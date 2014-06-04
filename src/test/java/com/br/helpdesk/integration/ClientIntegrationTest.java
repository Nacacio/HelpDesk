package com.br.helpdesk.integration;

import com.br.helpdesk.repository.*;
import com.br.helpdesk.controller.ClientController;
import com.br.helpdesk.model.Client;
import com.br.helpdesk.service.ClientService;
import com.br.helpdesk.util.TestUtil;
import com.github.springtestdbunit.DbUnitTestExecutionListener;
import com.github.springtestdbunit.annotation.DatabaseSetup;
import static org.hamcrest.Matchers.is;
import org.json.JSONArray;
import org.json.JSONObject;
import static org.junit.Assert.assertThat;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/configuration/application.xml",
    "file:src/main/webapp/WEB-INF/configuration/database_test.xml", "file:src/main/webapp/WEB-INF/configuration/security.xml"})
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class,
    DirtiesContextTestExecutionListener.class,
    TransactionalTestExecutionListener.class,
    DbUnitTestExecutionListener.class})
@DatabaseSetup("CompleteData.xml")
public class ClientIntegrationTest {
    
    private MockMvc mockMvc;
    
    @Autowired
    private ClientRepository repository;
    
    @Autowired
    private ClientService service;
    
    @InjectMocks
    private ClientController controller;
    
    
    /**
     * @author Andre
     * - Cria o servico e o repositorio reais,
     * - Cria um mock do controller
     */
    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        service.setRepository(repository);
        controller.setService(service);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }
    
    /**
     * @author Andre
     * - Verifica URL
     * - Verifica o retorno da fun��o
     * - Verifica se a quantidade de elementos retornados � a esperada.
     * @throws Exception
     */
    @Test
    public void testFindAll() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/client"))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se esta chamando corretamente a url
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8
                .andReturn();// retorna um objeto de tipo MvcResult 
        
        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONArray jsonArray = new JSONArray(contentString);//transforma o JSON String para JsonArray
        
        assertThat(jsonArray.length(), is(5));// verifica se a quantidade de objetos retornados � igual a 2, isso varia de acordo com a configura��o do "ClientData.xml"
    }
    
    
    @Test
    public void testFindByNameContainingNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/client").param("name", "NAO_EXISTE_ENTIDADE_COM_ESSE_NOME"))
                .andExpect(MockMvcResultMatchers.status().isNotFound());//verifica se o retorno � entityNotFound    
    }
    
    @Test
    public void testFindByIdEntityNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/client/{id}", 50L))
                .andExpect(MockMvcResultMatchers.status().isNotFound());//verifica se o retorno � entityNotFound    
    }
    
    @Test
    public void testFindByNameContainingOk() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/client").param("name", "EXISTE_ENTIDADE_COM_ESSE_NOME"))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se o retorno � ok 
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8;  
                .andReturn();
        
        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONArray jsonArray = new JSONArray(contentString);//transforma o JSON String para JsonObject
        
        //verificando se o objeto possui os dados esperados
        assertThat(jsonArray.length(), is(1));
        assertThat(jsonArray.getJSONObject(0).get("id").toString(), is("5"));
        assertThat(jsonArray.getJSONObject(0).getString("name"), is("EXISTE_ENTIDADE_COM_ESSE_NOME"));
    }
            
    @Test
    public void testFindByIdOk() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/client/{id}", 5L))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se o retorno � ok 
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8;  
                .andReturn();
        
        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONObject jsonObject = new JSONObject(contentString);//transforma o JSON String para JsonObject
        
        //verificando se o objeto possui os dados esperados
        assertThat(jsonObject.get("id").toString(), is("5"));
        assertThat(jsonObject.getString("name"), is("EXISTE_ENTIDADE_COM_ESSE_NOME"));
    }
    @Test
    public void testDeleteEntityNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/client/{id}", 50L))
                .andExpect(MockMvcResultMatchers.status().isNotFound());//verifica se o retorno � entityNotFound    
    }
    
    @Test
    public void testDeleteEntityDependency() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/client/{id}", 1L))
                .andExpect(MockMvcResultMatchers.status().isForbidden())//verifica se o retorno � forbidden    
                .andDo(MockMvcResultHandlers.print());
    }
    
    @Test
    public void testDeleteEntity() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/client/{id}", 5L))
                .andExpect(MockMvcResultMatchers.status().isOk());//verifica se o retorno � entityNotFound    
    }
    
    @Test
    public void testSaveNewEntity() throws Exception{
        Client client = new Client();
        client.setName("New Client");
        
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.put("/client")
                .content(TestUtil.convertObjectToJsonBytes(client))
                .contentType(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se o retorno � entityNotFound    
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8;
                .andReturn();
        
        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONObject jsonObject = new JSONObject(contentString);//transforma o JSON String para JsonObject
        
        //verificando se o objeto possui os dados esperados
        assertThat(jsonObject.getInt("id"), is(6));
        assertThat(jsonObject.getString("name"), is("New Client"));        
    }
    
    @Test
    public void testSaveChangeEntity() throws Exception{
        Client client = new Client();
        client.setId(2L);
        client.setName("New Client");
        
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.put("/client")
                .content(TestUtil.convertObjectToJsonBytes(client))
                .contentType(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(MockMvcResultMatchers.status().isOk())//verifica se o retorno � entityNotFound    
                .andExpect(MockMvcResultMatchers.content().contentType(TestUtil.APPLICATION_JSON_UTF8))//verifica se esta retornando um JSON na codifica��o UTF8;
                .andReturn();
        
        String contentString = mvcResult.getResponse().getContentAsString();//recebe o retorno da fun��o
        JSONObject jsonObject = new JSONObject(contentString);//transforma o JSON String para JsonObject
        
        //verificando se o objeto possui os dados esperados
        assertThat(jsonObject.get("id").toString(), is("2"));
        assertThat(jsonObject.getString("name"), is("New Client"));        
    }
}