package com.br.helpdesk.service;

import com.br.helpdesk.model.Client;
import com.br.helpdesk.repository.ClientRepository;
import java.util.List;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class ClientService{
    
    @Resource
    private ClientRepository repository;
    
    public void setRepository(ClientRepository repository) {
        this.repository = repository;
    }
    public List<Client> findByNameContaining(String name){        
        return repository.findByNameContaining(name);
    }
    public Client save(Client classe) {
        return repository.save(classe);
    }

    public void remove(Client classe) {
        repository.delete(classe);
    }

    public void removeArray(List<Client> objetos) {
        for (Client client : objetos) {
            remove(client);
        }
    }

    public Iterable<Client> findAll() {
        return repository.findAll();
    }

    public Client findById(Long codigo) {
        return repository.findOne(codigo);
    }    
}
