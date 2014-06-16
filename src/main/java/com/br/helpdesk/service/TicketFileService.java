package com.br.helpdesk.service;

import com.br.helpdesk.model.TicketFile;
import com.br.helpdesk.repository.TicketFileRepository;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import javax.annotation.Resource;
import javax.servlet.ServletContext;
import org.springframework.stereotype.Service;

@Service
public class TicketFileService{
    
    @Resource
    private TicketFileRepository repository;
    
    public void setRepository(TicketFileRepository repository) {
        this.repository = repository;
    }
    public List<TicketFile> findByNameContaining(String name){        
        return repository.findByNameContaining(name);
    }
    public TicketFile save(TicketFile classe) {
        return repository.save(classe);
    }

    public void remove(TicketFile classe) {
        repository.delete(classe);
    }

    public void removeArray(List<TicketFile> objetos) {
        for (TicketFile file : objetos) {
            remove(file);
        }
    }

    public Iterable<TicketFile> findAll() {
        return repository.findAll();
    }

    public TicketFile findById(Long codigo) {
        return repository.findOne(codigo);
    }   
    
    public List<TicketFile> findByTicket(Long idTicket){        
        return repository.findByTicket(idTicket);
    }
    
    public File createTempDirectory() throws IOException
    {
        final File temp;
        
        temp = File.createTempFile("ArquivosTemp", Long.toString(System.nanoTime()));
        
        if(!(temp.delete()))
        {
            throw new IOException("Could not delete temp file: " + temp.getAbsolutePath());
        }
        
        if(!(temp.mkdir()))
        {
            throw new IOException("Could not create temp directory: " + temp.getAbsolutePath());
        }
        
        return (temp);
    }
    
    public String getListFilesJSON(List<TicketFile> ticketFileList){
        if(ticketFileList != null && ticketFileList.size() > 0){
            String retornoJSON = "[";
            for (TicketFile ticketFile : ticketFileList) {
                retornoJSON+= "{";
                retornoJSON+= "fileId:'"+ticketFile.getId()+"', ";
                retornoJSON+= "fileName:'"+ticketFile.getName()+"', ";
                retornoJSON+= "fileTicketId:'"+ticketFile.getTicket().getId()+"', ";
                if(ticketFile.getTicketAnswer() != null){
                    retornoJSON+= "fileTicketAnswerId:'"+ticketFile.getTicketAnswer().getId()+"'";
                }
                else{
                    retornoJSON+= "fileTicketAnswerId:''";
                }
                retornoJSON+= "},";
            }
            retornoJSON += "]"; 
            
            return retornoJSON;
        }
        return "";
        
    }
}
