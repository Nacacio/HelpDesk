/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.model;

import java.io.Serializable;
import java.util.List;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "MENU")
public class Menu implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID")
    private Long id;
    
    @Basic
    @Column(name= "TEXT")
    private String text;
    
    @Basic
    @Column(name="ICON_CLS")
    private String iconCls;
    
    @Basic
    @Column(name="CLASS_NAME")
    private String className;
    
    @ManyToOne
    @JoinColumn(name="PARENT_MENU",nullable=true)
    private Menu menu;
    
    @OneToMany(fetch = FetchType.EAGER,mappedBy = "menu",targetEntity = Menu.class)
    private List<Menu> items;
    
    
    /**
     * @return the id
     */
    public Long getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * @return the text
     */
    public String getText() {
        return text;
    }

    /**
     * @param text the text to set
     */
    public void setText(String text) {
        this.text = text;
    }

    /**
     * @return the iconCls
     */
    public String getIconCls() {
        return iconCls;
    }

    /**
     * @param iconCls the iconCls to set
     */
    public void setIconCls(String iconCls) {
        this.iconCls = iconCls;
    }

    /**
     * @return the className
     */
    public String getClassName() {
        return className;
    }

    /**
     * @param className the className to set
     */
    public void setClassName(String className) {
        this.className = className;
    }

    /**
     * @return the menu
     */
    public Menu getMenu() {
        if(menu!=null){
            menu.setItems(null); // avoid n+1 selects
        }
        return menu;
    }

    /**
     * @param menu the menu to set
     */
    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    /**
     * @return the items
     */
    public List<Menu> getItems() {
        return items;
    }

    /**
     * @param items the items to set
     */
    public void setItems(List<Menu> items) {
        this.items = items;
    }


}
