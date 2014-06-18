/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.service;

import com.br.helpdesk.model.ConfigEmail;
import com.br.helpdesk.repository.ConfigEmailRepository;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;

/**
 *
 * @author Sulivam
 */
@Service
public class ConfigEmailService {

    @Resource
    private ConfigEmailRepository repository;

    public ConfigEmail findById(Long id) {
        return repository.findOne(id);
    }
}
