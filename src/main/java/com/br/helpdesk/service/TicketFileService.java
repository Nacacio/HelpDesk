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
    
    public String createFile(Long idFile,ServletContext contexto) throws FileNotFoundException, IOException{
        TicketFile ticketFile = findById(idFile);
        File file = getFile(ticketFile.getName(),contexto);
        FileOutputStream fos = new FileOutputStream(file);
        fos.write(ticketFile.getByteArquivo());
        fos.flush();
        fos.close();
        
        return returnJSON(file.getName(),"",contexto);
    }
    private String returnJSON(String nomeArquivo,String erro,ServletContext contexto){
        String retorno ="{path:'"+getPathTomCat(contexto)+"' , " +
                "nomeArquivo:'"+nomeArquivo+"' , " +
                "erro:'"+erro+"'}";        
        return retorno;
    }

    private File getFile(String fileName,ServletContext contexto){
        File tempDir = getPastaArquivosTemp(contexto);
        if(!tempDir.exists())
            tempDir.mkdir();
        
        File file = new File(tempDir, fileName);
        
        if(file.exists()){
            file.delete();
        }
        return file;
    }
    
    private String getPathTomCat(ServletContext contexto){
        String path = "";
        int indexInicio= 0;
        try{
            String fileSeparator = System.getProperty("file.separator");
            File f = getPastaArquivosTemp(contexto).getAbsoluteFile();
            indexInicio=f.getParent().lastIndexOf(fileSeparator);
            path = f.getAbsolutePath().substring(indexInicio);
            if(!fileSeparator.equals("/")){
                while(path.indexOf(fileSeparator) > -1)
                    path =  path.replace(fileSeparator, "/");
            }
        }
        catch(Exception e){
            e.printStackTrace();
        }       
        
        return path;
        
    }
    
    private File getPastaArquivosTemp(ServletContext contexto){        
        File diretorio = null;
        try{
            diretorio = new File(contexto.getRealPath("ArquivosTemp"));
        }
        catch(Exception npe){
            diretorio = new File("ArquivosTemp/");
        }
        return diretorio;
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
