/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.model;

import java.util.Date;
import java.util.List;

/**
 *
 * @author Sulivam
 */
public class GraphicContainer {
    
    private Date date;
    private String dateString;
    
    // graphic category
    private List<CategoryContainer> listCategory;
    
    //graphic client
    private List<ClientContainer> listClient;
    
    // graphic user
    private int created;
    private int closed;

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDateString() {
        return dateString;
    }

    public void setDateString(String dateString) {
        this.dateString = dateString;
    }
    
    public List<CategoryContainer> getListCategory() {
        return listCategory;
    }

    public void setListCategory(List<CategoryContainer> listCategory) {
        this.listCategory = listCategory;
    }
    
    public List<ClientContainer> getListClient() {
        return listClient;
    }

    public void setListClient(List<ClientContainer> listClient) {
        this.listClient = listClient;
    }

    public int getCreated() {
        return created;
    }

    public void setCreated(int created) {
        this.created = created;
    }

    public int getClosed() {
        return closed;
    }

    public void setClosed(int closed) {
        this.closed = closed;
    }

    
}
