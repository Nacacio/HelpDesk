package com.br.helpdesk.service;

import com.Consts;
import com.br.helpdesk.model.Category;
import com.br.helpdesk.repository.CategoryRepository;
import java.util.List;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class CategoryService{
    
    @Resource
    private CategoryRepository repository;
    
    public void setRepository(CategoryRepository repository) {
        this.repository = repository;
    }
    public Category findByNameContaining(String name){
        return repository.findByNameContaining(name);
    }
    
    public Category save(Category classe) {
        return repository.save(classe);
    }

    public void remove(Category classe) {
        repository.delete(classe);
    }

    public void removeArray(List<Category> objetos) {
        for (Category category : objetos) {
            remove(category);
        }
    }

    public Iterable<Category> findAll() {
        List<Category> list = (List)repository.findAll();
        for(int i = 0; i < list.size(); i++){
            if(list.get(i).getName().equals(Consts.NO_CATEGORY_EN)){
                list.remove(i);
                break;
            }
        }
        return list;
    }

    public Category findById(Long codigo) {
        return repository.findOne(codigo);
    }    
}
