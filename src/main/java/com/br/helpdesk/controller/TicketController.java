package com.br.helpdesk.controller;

import com.br.helpdesk.email.EmailUtil;
import com.br.helpdesk.model.TicketFile;
import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.User;
import com.br.helpdesk.service.TicketFileService;
import com.br.helpdesk.service.TicketService;
import com.br.helpdesk.service.UserService;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FilenameFilter;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.AccessController;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.data.domain.PageRequest;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;


@Controller
@RequestMapping("/ticket")
public class TicketController {
    
    @Autowired
    private TicketService ticketService;
    
    public void setService(TicketService service){
        this.ticketService = service;
    }
    
    @Autowired
    public TicketController(TicketService service){
        this.ticketService = service;
    }
    
    @Autowired
    private UserService userService;
    
    public void setUserService(UserService service){
        this.userService = service;
    }
    
    @Autowired
    private TicketFileService fileService;
    
    public void setFileService(TicketFileService service){
        this.fileService = service;
    }
    
    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody List<Ticket> getAllTickets() {
        return ticketService.findAll();
    }
    
    @RequestMapping(value = "/all", method = RequestMethod.GET, params={"user"})
    public @ResponseBody List<Ticket> getAllTicketsByUser(@RequestParam(value = "user") String username) {
        User user = this.userService.findByUserName(username);
        if(user.getUserGroup().getId() == 1L){//SUPERUSER
            return ticketService.findAll();
        }
        else{
            return ticketService.findByUser(user);
        }
    }
    
    @RequestMapping(value = "/all-paging", method = RequestMethod.GET, params={"user","start", "limit"})
    public @ResponseBody List<Ticket> getAllTicketsByUserPaging(@RequestParam(value = "user") String username,  @RequestParam(value = "start") int start, @RequestParam(value = "limit")  int limit) {
        User user = this.userService.findByUserName(username);
        PageRequest pageRequest = getPageRequest(limit,start);
        
        if(user.getUserGroup().getId() == 1L){//SUPERUSER
            return ticketService.findAll(pageRequest);
        }
        else{
            return ticketService.findByUserWithPaging(user,pageRequest);
        }
    }
    
    @RequestMapping(value = "/opened", method = RequestMethod.GET, params={"user"})
    public @ResponseBody List<Ticket> getTicketsOpenedByUser(@RequestParam(value = "user") String username) {
        User user = this.userService.findByUserName(username);
        
        if(user.getUserGroup().getId() == 1L){//SUPERUSER
            return ticketService.findByIsOpen(true);
        }
        else{
            return ticketService.findByIsOpenAndUser(true,user);
        }
    }
    
    @RequestMapping(value = "/opened-paging", method = RequestMethod.GET, params={"user","start","limit"})
    public @ResponseBody List<Ticket> getTicketsOpenedByUserWithPaging(@RequestParam(value = "user") String username, @RequestParam(value = "start") int start, @RequestParam(value = "limit")  int limit) {
        User user = this.userService.findByUserName(username);
        PageRequest pageRequest = getPageRequest(limit,start);
        
        if(user.getUserGroup().getId() == 1L){//SUPERUSER
            return ticketService.findByIsOpenWithPaging(true,pageRequest);
        }
        else{
            return ticketService.findByIsOpenAndUser(true,user);
        }
    }
    
    @RequestMapping(value = "/closed", method = RequestMethod.GET, params={"user"})
    public @ResponseBody List<Ticket> getTicketsClosedByUser(@RequestParam(value = "user") String username) {
        User user = this.userService.findByUserName(username);
        if(user.getUserGroup().getId() == 1L){//SUPERUSER
            return ticketService.findByIsOpen(false);
        }
        else{
            return ticketService.findByIsOpenAndUser(false,user);
        }
    }
    
    @RequestMapping(value = "/closed-paging", method = RequestMethod.GET, params={"user","start","limit"})
    public @ResponseBody List<Ticket> getTicketsClosedByUserWithPaging(@RequestParam(value = "user") String username, @RequestParam(value = "start") int start, @RequestParam(value = "limit")  int limit) {
        User user = this.userService.findByUserName(username);
        PageRequest pageRequest = getPageRequest(limit,start);
        
        if(user.getUserGroup().getId() == 1L){//SUPERUSER
            return ticketService.findByIsOpenWithPaging(false,pageRequest);
        }
        else{
            return ticketService.findByIsOpenAndUserWithPaging(false,user,pageRequest);
        }
    }
    
    @RequestMapping(value = "/mytickets", method = RequestMethod.GET, params={"user"})
    public @ResponseBody List<Ticket> getMyTickets(@RequestParam(value = "user") String username) {
        User user = this.userService.findByUserName(username);
        
        return ticketService.findByResponsavel(user);
    }
    
    @RequestMapping(value = "/mytickets-paging", method = RequestMethod.GET, params={"user","start", "limit"})
    public @ResponseBody List<Ticket> getMyTicketsWithPaging(@RequestParam(value = "user") String username, @RequestParam(value = "start") int start, @RequestParam(value = "limit")  int limit) {
        User user = this.userService.findByUserName(username);
        PageRequest pageRequest = getPageRequest(limit,start);
        return ticketService.findByResponsavelWithPaging(user,pageRequest);
    }
    
    @RequestMapping(value = "/withoutresponsible", method = RequestMethod.GET, params={"user"})
    public @ResponseBody List<Ticket> getTicketsWithoutResponsible(@RequestParam(value = "user") String username) {
        return ticketService.findByResponsavel(null);
    }
    
    @RequestMapping(value = "/withoutresponsible-paging", method = RequestMethod.GET, params={"user","start","limit"})
    public @ResponseBody List<Ticket> getTicketsWithoutResponsibleWithPaging(@RequestParam(value = "user") String username, @RequestParam(value = "start") int start, @RequestParam(value = "limit")  int limit) {
        PageRequest pageRequest = getPageRequest(limit,start);
        return ticketService.findByResponsavelWithPaging(null,pageRequest);
    }
    
    
    @RequestMapping(value = "/textmenu", method = RequestMethod.GET, params={"user"}, produces="application/json;charset=UTF-8")
    public @ResponseBody String getTextMenu(@RequestParam(value = "user") String username, HttpServletResponse response) throws UnsupportedEncodingException {
        User user = this.userService.findByUserName(username);
        int todos,abertos,fechados,withoutresponsible,mytickets;
        if(user.getUserGroup().getId() == 1L){//SUPERUSER
            todos = ticketService.findAll().size();
            abertos = ticketService.findByIsOpen(true).size();
            fechados = ticketService.findByIsOpen(false).size();
            mytickets = ticketService.findByResponsavel(user).size();
            withoutresponsible = ticketService.findByResponsavel(null).size();
        }
        else{
            todos = ticketService.findByUser(user).size();
            abertos = ticketService.findByIsOpenAndUser(true, user).size();
            fechados = ticketService.findByIsOpenAndUser(false, user).size();
            mytickets = 0;
            withoutresponsible = 0;
        }
        return "{\"todos\":'" +todos+"', \"abertos\": '"+abertos+"', \"fechados\": '"+fechados+"', \"mytickets\": '"+mytickets+"', \"withoutresponsible\": '"+withoutresponsible+"'}";
    }
    
    @RequestMapping(value = {"close-ticket/{id}"}, method = {RequestMethod.PUT})
    @ResponseBody
    public Ticket closeTicket(@RequestBody Ticket ticket) {
        ticket.setIsOpen(false);
        ticket.setEndDate(Calendar.getInstance().getTime());
        return ticketService.save(ticket);
    }
    
    @RequestMapping(value = {"open-ticket/{id}"}, method = {RequestMethod.PUT})
    @ResponseBody
    public Ticket openTicket(@RequestBody Ticket ticket) {
        ticket.setIsOpen(true);
        ticket.setEndDate(null);
        return ticketService.save(ticket);
    }
    

    
    @RequestMapping(value = {"", "/{id}"}, method = {RequestMethod.POST,RequestMethod.PUT}, params={"user"})
    @ResponseBody
    public Ticket save(@RequestBody Ticket ticket,@RequestParam(value = "user") String username) throws IOException {
        List<File> filesToSave = getFilesFromUser(username);
        boolean newTicket = false;
        if(ticket.getId()==null || ticket.getId()==0){
            newTicket = true;
        }
        ticket = ticketService.save(ticket);
        TicketFile ticketFile = null;
        for (File file : filesToSave){
            //file.renameTo(file.getName().replace(username, username));
            ticketFile = new TicketFile();
            ticketFile.setName(file.getName());
            ticketFile.setByteArquivo(getBytesFromFile(file));
            ticketFile.setTicket(ticket);
            fileService.save(ticketFile);
            file.delete();
        }        
        
        /*if(newTicket){
            
        } else {
            
        }
        EmailUtil eu = new EmailUtil();*/
        //eu.sendEmail(ticket.getTitle(), ticket.getCategory().getName(), ticket.getDescription(), ticket.getStepsTicket());

        return ticket;
    }
    
    /**
     * upload
     */
    @RequestMapping(value = "/files", method = RequestMethod.POST)
    @ResponseBody
    public String uploadFile(HttpServletRequest request,HttpServletResponse response) throws Exception {
        String username = request.getParameter("username");
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;        
        Collection<MultipartFile> filesCollection = multipartRequest.getFileMap().values();
        try{
            for (MultipartFile multipartFile : filesCollection) {
                String fileName = "##"+username+"##"+multipartFile.getOriginalFilename();
                createFile(fileName, multipartFile.getBytes());
            }
        }
        catch (IOException e){
            return "{success: false}";
        }
        return "{success: true}";
    }
    public List<File> getFilesFromUser(String username) throws FileNotFoundException, IOException {
        File folder = new File(System.getProperty("java.io.tmpdir"));
        final String sufixnamefile = "##"+username+"##";
        List<File> filesToSave = new ArrayList<File>();
        
        
        FilenameFilter fileFilter = new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                return name.toLowerCase().contains(sufixnamefile);
            }
        };
        
        File filesFromUser[] = folder.listFiles(fileFilter);
        for (File tempFile : filesFromUser) {
            String fileName = tempFile.getName().replace(sufixnamefile, ""); 
            File file = createFile(fileName,getBytesFromFile(tempFile));
            tempFile.delete();
            filesToSave.add(file);
        }

        return filesToSave;
    }
    
    public byte[] getBytesFromFile(File file){
        FileInputStream fileInputStream=null;
 
        byte[] bFile = new byte[(int) file.length()];
 
        try {
            //convert file into array of bytes
	    fileInputStream = new FileInputStream(file);
	    fileInputStream.read(bFile);
	    fileInputStream.close();
 	    return bFile;
        }catch(Exception e){
        	e.printStackTrace();
        }
        return null;        
    }

     /**
     * download
     */
    @RequestMapping(value = "/files/{fileId}", method = RequestMethod.GET)
    @ResponseBody
    public void downloadFile(HttpServletRequest request,HttpServletResponse response,@PathVariable(value="fileId")Long fileId ) throws Exception {        
        TicketFile ticketFile = fileService.findById(fileId);
         
        response.setContentType(ticketFile.getContentType());
        response.setContentLength(ticketFile.getByteArquivo().length);
        response.setHeader("Content-Disposition","attachment; filename=\"" + ticketFile.getName() +"\"");
 
        FileCopyUtils.copy(ticketFile.getByteArquivo(), response.getOutputStream());
    }
    
    @RequestMapping(value = "/{ticketId}/files", method = RequestMethod.GET)
    @ResponseBody
    public String getFilesListFromTicket(HttpServletRequest request,HttpServletResponse response,@PathVariable(value="ticketId")Long ticketId ) throws Exception {
        List<TicketFile> listFiles = fileService.findByTicket(ticketId);
        String returnJson = fileService.getListFilesJSON(listFiles);
        return returnJson;
    }
    
    public PageRequest getPageRequest(int limit,int start){
        int pageSize = limit - start;
        int page;
        if (start == 0) {
            page = 0;
        } else {
            page = (limit / pageSize) - 1;
        }
        return new PageRequest(page, pageSize);
    }
    
    public File createFile(String fileName,byte[] bytes) throws FileNotFoundException, IOException{ 
        String tempPath = System.getProperty("java.io.tmpdir");
        String path = tempPath + File.separator + fileName;
        File file = new File(path);
        FileOutputStream fos = new FileOutputStream(file);
        fos.write(bytes);
        fos.flush();
        fos.close();        
        return file;
    }
    
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(value=HttpStatus.NOT_FOUND,reason = "Entidade não encontrada")
    public void handleEntityNotFoundException(Exception ex){}
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    public void handleDataIntegrityViolationException(DataIntegrityViolationException ex,HttpServletResponse response) throws IOException {
        response.sendError(HttpServletResponse.SC_FORBIDDEN, ex.getMessage());
    }
}
