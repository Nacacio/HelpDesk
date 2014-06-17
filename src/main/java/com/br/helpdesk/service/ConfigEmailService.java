/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.service;

import com.br.helpdesk.model.ConfigEmail;
import com.br.helpdesk.repository.ConfigEmailRepository;
import javax.annotation.Resource;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Service;

/**
 *
 * @author Sulivam
 */
@Service
@Configurable
public class ConfigEmailService {

    @Resource
    private ConfigEmailRepository repository;

    public ConfigEmail findById(long id) {
        return repository.findById(id);
    }
}
