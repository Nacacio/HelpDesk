package com.br.helpdesk.service;

import com.br.helpdesk.model.Menu;
import com.br.helpdesk.repository.MenuRepository;
import java.util.List;
import javax.annotation.Resource;
import org.apache.commons.collections.IteratorUtils;
import org.springframework.stereotype.Service;

@Service
public class MenuService{   
    
    @Resource
    private MenuRepository repository;
    
    public void setRepository(MenuRepository repository) {
        this.repository = repository;
    }
    
    public Menu save(Menu model){
        return repository.save(model);
    }
    public List<Menu> findAll(){
        return IteratorUtils.toList(repository.findAll().iterator());
    }
    public void delete(Menu model){
        repository.delete(model);
    }   
}
