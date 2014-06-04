package com.br.helpdesk.service;

import com.br.helpdesk.model.UserGroup;
import com.br.helpdesk.repository.UserGroupRepository;
import java.util.List;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class UserGroupService{
    
     @Resource
    private UserGroupRepository repository;
    
    public void setRepository(UserGroupRepository repository) {
        this.repository = repository;
    }
    
   public List<UserGroup> findByNameContaining(String name){        
        return repository.findByNameContaining(name);
    }
    public UserGroup save(UserGroup classe) {
        return repository.save(classe);
    }

    public void remove(UserGroup classe) {
        repository.delete(classe);
    }

    public void removeArray(List<UserGroup> objetos) {
        for (UserGroup group : objetos) {
            remove(group);
        }
    }

    public Iterable<UserGroup> findAll() {
        return repository.findAll();
    }

    public UserGroup findById(Long codigo) {
        return repository.findOne(codigo);
    }   
}
