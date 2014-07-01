package com.br.helpdesk.service;

import com.br.helpdesk.model.Attachments;
import com.br.helpdesk.repository.AttachmentsRepository;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FilenameFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class AttachmentsService {

    @Resource
    private AttachmentsRepository repository;

    public void setRepository(AttachmentsRepository repository) {
        this.repository = repository;
    }

    public List<Attachments> findByNameContaining(String name) {
        return repository.findByNameContaining(name);
    }

    public Attachments save(Attachments classe) {
        return repository.save(classe);
    }

    public void remove(Attachments classe) {
        repository.delete(classe);
    }

    public void removeArray(List<Attachments> objetos) {
        for (Attachments file : objetos) {
            remove(file);
        }
    }

    public Iterable<Attachments> findAll() {
        return repository.findAll();
    }

    public Attachments findById(Long codigo) {
        return repository.findOne(codigo);
    }

    public List<Attachments> findByTicket(Long idTicket) {
        return repository.findByTicket(idTicket);
    }

    public List<Attachments> findByAnswer(Long idAnswer) {
        return repository.findByAnswer(idAnswer);
    }

    public File createTempDirectory() throws IOException {
        final File temp;

        temp = File.createTempFile("ArquivosTemp", Long.toString(System.nanoTime()));

        if (!(temp.delete())) {
            throw new IOException("Could not delete temp file: " + temp.getAbsolutePath());
        }

        if (!(temp.mkdir())) {
            throw new IOException("Could not create temp directory: " + temp.getAbsolutePath());
        }

        return (temp);
    }

    public String getListFilesJSON(List<Attachments> attachments) {
        if (attachments != null && attachments.size() > 0) {
            String retornoJSON = "[";
            for (int i = 0; i < attachments.size(); i++) {
                if (i != 0) {
                    retornoJSON += ",";
                }
                retornoJSON += "{";
                retornoJSON += "fileId:'" + attachments.get(i).getId() + "', ";
                retornoJSON += "fileName:'" + attachments.get(i).getName() + "', ";
                if (attachments.get(i).getTicket() != null) {
                    retornoJSON += "fileTicketId:'" + attachments.get(i).getTicket().getId() + "',";
                } else {
                    retornoJSON += "fileTicketId:'',";
                }
                if (attachments.get(i).getTicketAnswer() != null) {
                    retornoJSON += "fileTicketAnswerId:'" + attachments.get(i).getTicketAnswer().getId() + "'";
                } else {
                    retornoJSON += "fileTicketAnswerId:''";
                }
                retornoJSON += "}";
            }
            retornoJSON += "]";

            return retornoJSON;
        }
        return "";
    }

    public List<File> getAttachmentsFromUser(String username) throws FileNotFoundException, IOException {
        File folder = new File(System.getProperty("java.io.tmpdir"));
        final String sufixnamefile = "##" + username + "##";
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
            File file = createFile(fileName, getBytesFromFile(tempFile));
            tempFile.delete();
            filesToSave.add(file);
        }

        return filesToSave;
    }

    public File createFile(String fileName, byte[] bytes) throws FileNotFoundException, IOException {
        String tempPath = System.getProperty("java.io.tmpdir");
        String path = tempPath + File.separator + fileName;
        File file = new File(path);
        FileOutputStream fos = new FileOutputStream(file);
        fos.write(bytes);
        fos.flush();
        fos.close();
        return file;
    }

    public byte[] getBytesFromFile(File file) {
        FileInputStream fileInputStream = null;

        byte[] bFile = new byte[(int) file.length()];

        try {
            //convert file into array of bytes
            fileInputStream = new FileInputStream(file);
            fileInputStream.read(bFile);
            fileInputStream.close();
            return bFile;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
