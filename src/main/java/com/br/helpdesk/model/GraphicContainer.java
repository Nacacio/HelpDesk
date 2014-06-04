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
    private List<CategoryContainer> listCategory;
    private List<ClientContainer> listClient;

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

    
}
