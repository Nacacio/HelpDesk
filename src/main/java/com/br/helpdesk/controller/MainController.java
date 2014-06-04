package com.br.helpdesk.controller;

import com.br.helpdesk.model.Client;
import com.br.helpdesk.model.User;
import com.br.helpdesk.model.UserGroup;
import com.br.helpdesk.repository.ClientRepository;
import com.br.helpdesk.repository.TicketRepository;
import com.br.helpdesk.repository.UserGroupRepository;
import com.br.helpdesk.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.annotation.Resource;
import org.json.JSONObject;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/")
public class MainController {

    public static final String BAD_CREDENTIALS = "badcredentials";
    public static final String CREDENTIALS_EXPIRED = "credentialsexpired";
    public static final String ACCOUNT_LOCKED = "accountlocked";
    public static final String ACCOUNT_DISABLED = "accountdisabled";
    @Resource
    private UserRepository userRepository;
    @Resource
    private ClientRepository clientRepository;    
    @Resource
    private UserGroupRepository userGroupRepository;
    
    @RequestMapping(value="/login",method = RequestMethod.POST)
    @ResponseBody
    public User createFromLogin(@RequestBody String user) {
        JSONObject jsObject = new JSONObject(user);
        User newUsuario = new User();
        List<Client> clients = clientRepository.findByNameContaining((String)jsObject.get("client"));
        Client client = null;
        if(clients == null || clients.size() == 0){
            //CRIAR NOVO CLIENT
            client = new Client();
            client.setName((String)jsObject.get("client"));
            client = clientRepository.save(client);
        }
        else{
            client = clients.get(0);
        }
        //USER GROUP 
        //1 - SUPERUSUARIO 
        //2 - CLIENTE
        UserGroup ug = userGroupRepository.findOne(new Long(2));
        
        newUsuario.setName((String)jsObject.get("name"));
        newUsuario.setEmail((String)jsObject.get("email"));
        newUsuario.setIsEnabled(true);
        newUsuario.setPassword((String)jsObject.get("password"));
        newUsuario.setUserName((String)jsObject.get("userName"));
        newUsuario.setClient(client);
        newUsuario.setUserGroup(ug);
        
        newUsuario = userRepository.save(newUsuario);
        //return user;
        return newUsuario;
    }
    
    @RequestMapping(value = "/login/validuser", method = RequestMethod.POST, params={"username"})
    public @ResponseBody
    Boolean userValidation(@RequestParam(value = "username") String username) {
        User user = userRepository.findByUserName(username);
        if(user != null)
            return false;
        return true;
    }
    
    @RequestMapping(method = RequestMethod.GET)
    public ModelAndView getHome() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView modelAndView = new ModelAndView("home");
        User user = userRepository.findByUserName(auth.getName());
        JSONObject jsObject = new JSONObject(user);
        
        modelAndView.addObject("user", auth.getName());
        modelAndView.addObject("logged", true);
        modelAndView.addObject("client", user.getClient().getId());
        modelAndView.addObject("email", user.getEmail());
        modelAndView.addObject("name", user.getName());
        modelAndView.addObject("userGroup", user.getUserGroup().getId());
        modelAndView.addObject("userLogged", jsObject.toString().replace("\"", "\'"));
        
        return modelAndView;
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ModelAndView getLogin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        ModelAndView modelAndView = new ModelAndView("login");
        if (!auth.getName().equals("anonymousUser")) {
            User user = userRepository.findByUserName(auth.getName());
            modelAndView.addObject("user", auth.getName());
            modelAndView.addObject("logged", true);
            modelAndView.addObject("client", user.getClient().getId());
            modelAndView.addObject("email", user.getEmail());
        } else {
            modelAndView.addObject("logged", false);
            modelAndView.addObject("user", "anonymousUser");
            modelAndView.addObject("client", "none");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/loginsuccessful")
    public @ResponseBody
    String loginSuccessful() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String name = auth.getName(); //get logged in username
        return "{success: true,username: \'" + name + "\'}";
    }

    @RequestMapping(value = "/login/{error}")
    public @ResponseBody
    String displayLoginform(@PathVariable final String error) {
        return "{success: false,error: \'" + error + "\'}";
    }

}
