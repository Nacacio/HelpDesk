/*
* To change this license header, choose License Headers in Project Properties.
* To change this template file, choose Tools | Templates
* and open the template in the editor.
*/

package com.br.helpdesk.controller;
import com.br.helpdesk.model.Category;
import com.br.helpdesk.service.CategoryService;
import java.io.IOException;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
@RequestMapping("/category")
public class CategoryController {
    
    private CategoryService categoryService;
    
    public void setService(CategoryService service){
        this.categoryService = service;
    }
    
    @Autowired
    public CategoryController(CategoryService service){
        this.categoryService = service;
    }
    
    
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody Iterable<Category> findAll() {
        return categoryService.findAll();
    }
    
    @RequestMapping(method = RequestMethod.GET, params={"name"})
    public @ResponseBody Category findByNameContaining(@RequestParam(value = "name") String name){
        Category category = categoryService.findByNameContaining(name);
        if(category == null){
             throw new EntityNotFoundException();
        }
        return category;
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody Category findById(@PathVariable long id) throws EntityNotFoundException{
        Category category = categoryService.findById(id);
        if(category == null){
             throw new EntityNotFoundException();
        }
        return category;
    }
    
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public @ResponseBody void delete(@PathVariable Long id) throws EntityNotFoundException,DataIntegrityViolationException{
        Category category = categoryService.findById(id);
        if(category == null){
            throw new EntityNotFoundException();
        }
        try{
            categoryService.remove(category);
        }
        catch(Exception e){
            throw new DataIntegrityViolationException("Entidade possui dependencias e não pode ser deletada");//DEPENDENCIAS
        }
    }
    @RequestMapping(value = {"", "/{id}"}, method = {RequestMethod.PUT, RequestMethod.POST})
    @ResponseBody
    public Category save(@RequestBody Category category) {
        category = categoryService.save(category);
        return category;
    }
    
    /**
     * Exceptions Handler
     */
    
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(value=HttpStatus.NOT_FOUND,reason = "Entidade não encontrada")
    public void handleEntityNotFoundException(Exception ex){}
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    public void handleDataIntegrityViolationException(DataIntegrityViolationException ex,HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_FORBIDDEN, ex.getMessage());
    }
}
