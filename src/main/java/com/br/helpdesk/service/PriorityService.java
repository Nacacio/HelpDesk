package com.br.helpdesk.service;

import com.br.helpdesk.model.Priority;
import com.br.helpdesk.repository.PriorityRepository;
import java.util.List;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class PriorityService{
    
    @Resource
    private PriorityRepository repository;
    
    public void setRepository(PriorityRepository repository) {
        this.repository = repository;
    }
    public List<Priority> findByNameContaining(String name){        
        return repository.findByNameContaining(name);
    }
    public Priority save(Priority classe) {
        return repository.save(classe);
    }

    public void remove(Priority classe) {
        repository.delete(classe);
    }

    public void removeArray(List<Priority> objetos) {
        for (Priority priority : objetos) {
            remove(priority);
        }
    }

    public Iterable<Priority> findAll() {
        return repository.findAll();
    }

    public Priority findById(Long codigo) {
        return repository.findOne(codigo);
    }    
}
