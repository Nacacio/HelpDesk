/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.model.key;

import com.br.helpdesk.model.Menu;
import com.br.helpdesk.model.UserGroup;
import java.io.Serializable;
import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 *
 * @author rafaelpossas
 */
@Embeddable
public class PermissionId implements Serializable {
    
    public PermissionId(){
        
    }
    @ManyToOne
    @JoinColumn(name="USER_GROUP")
    private UserGroup userGroup;
    @ManyToOne
    @JoinColumn(name="MENU")
    private Menu menu;
    
    @Override
    public int hashCode(){
        return getUserGroup().getId().intValue()+getMenu().getId().intValue();
    }
    @Override
    public boolean equals(Object obj){
        if(obj instanceof PermissionId){
            PermissionId permId = (PermissionId) obj;
            if(permId.getMenu().getId().intValue() == getMenu().getId().intValue() 
               && permId.getUserGroup().getId().intValue() == getUserGroup().getId().intValue()){
                return true;
            }
        }
        return false;
    }

    /**
     * @return the userGroup
     */
    public UserGroup getUserGroup() {
        return userGroup;
    }

    /**
     * @param userGroup the userGroup to set
     */
    public void setUserGroup(UserGroup userGroup) {
        this.userGroup = userGroup;
    }

    /**
     * @return the menu
     */
    public Menu getMenu() {
        return menu;
    }

    /**
     * @param menu the menu to set
     */
    public void setMenu(Menu menu) {
        this.menu = menu;
    }
    
    
}
