/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.model;
import com.br.helpdesk.model.key.PermissionId;
import java.io.Serializable;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.IdClass;
import javax.persistence.Table;


/**
 *
 * @author rafaelpossas
 */
@Entity
@Table(name="PERMISSION")
public class Permission implements Serializable {
    
    
    @EmbeddedId
    private PermissionId permissionId;

    /**
     * @return the permissionId
     */
    public PermissionId getPermissionId() {
        return permissionId;
    }

    /**
     * @param permissionId the permissionId to set
     */
    public void setPermissionId(PermissionId permissionId) {
        this.permissionId = permissionId;
    }

}
