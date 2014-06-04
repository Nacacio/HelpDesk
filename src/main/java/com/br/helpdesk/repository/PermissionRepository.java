/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.repository;
import com.br.helpdesk.model.Permission;
import com.br.helpdesk.model.key.PermissionId;
import org.springframework.data.repository.CrudRepository;

/**
 *
 * @author rafaelpossas
 */
public interface PermissionRepository extends CrudRepository<Permission, Integer> {
    Permission findByPermissionId(PermissionId permissionId);
}
