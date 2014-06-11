/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.util;

/**
 *
 * @author Andre
 */
 
public class ProgressDescriptor 
{
    public long bytesRead; 
    public long bytesTotal;
     
    public ProgressDescriptor() {
        bytesRead = bytesTotal = 0; 
    }
     
    public ProgressDescriptor(long bytesRead,
            long bytesTotal) 
    { 
        this.bytesRead = bytesRead; 
        this.bytesTotal = bytesTotal; 
    }
     
    public long getBytesRead() { 
        return bytesRead; 
    }
     
    public long getBytesTotal() { 
        return bytesTotal;
    }
     
    @Override
    public String toString() {
        return bytesRead + "/" + bytesTotal; 
    }
}