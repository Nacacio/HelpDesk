/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.email;

import java.io.IOException;

/**
 *
 * @author Andre
 */
public class EmailTest {
    public static void main(String [] args) throws IOException, Exception{
        EmailUtil emailUtil = new EmailUtil();
        /**
         * TITULO
         * CATEGORIA
         * OBSERVAÇÕES
         * PASSO-A-PASSO
         */
        emailUtil.novoTicket("Ticket #00123# - Teste","BUG","Inicio das observações \n\n\n\nFim das observações","Inicio do Passo a Passo \n\n\n\nFim do Passo a Passo");
        
        //emailUtil.getEmailsNaoLidos();
    }
}
