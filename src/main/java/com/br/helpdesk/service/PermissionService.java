package com.br.helpdesk.service;

import com.br.helpdesk.model.Permission;
import com.br.helpdesk.repository.PermissionRepository;
import java.util.List;
import javax.annotation.Resource;
import org.apache.commons.collections.IteratorUtils;
import org.springframework.stereotype.Service;

@Service
public class PermissionService{
    
    
    @Resource
    private PermissionRepository repository;
    
    public void setRepository(PermissionRepository repository) {
        this.repository = repository;
    }
    
    public Permission save(Permission model){
        return repository.save(model);
    }
    public List<Permission> findAll(){
        return IteratorUtils.toList(repository.findAll().iterator());
    }
    public void delete(Permission model){
        repository.delete(model);
    }   
}
