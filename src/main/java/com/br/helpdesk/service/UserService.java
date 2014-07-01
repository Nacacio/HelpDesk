package com.br.helpdesk.service;

import com.br.helpdesk.model.User;
import com.br.helpdesk.repository.UserRepository;
import java.util.List;
import javax.annotation.Resource;
import org.apache.commons.collections.IteratorUtils;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Resource
    private UserRepository repository;

    public void setRepository(UserRepository repository) {
        this.repository = repository;
    }

    public User save(User model) {
        return repository.save(model);
    }

    public List<User> findAll() {
        return IteratorUtils.toList(repository.findAll().iterator());
    }

    public void delete(User model) {
        repository.delete(model);
    }

    public User findByUserName(String username) {
        return repository.findByUserName(username);
    }

    public User findById(Long codigo) {
        return repository.findOne(codigo);
    }

    public List<User> findByUserAdmin() {
        return repository.findByUserAdmin();
    }

    public User findByEmail(String email) {
        return repository.findByEmail(email);
    }

}
