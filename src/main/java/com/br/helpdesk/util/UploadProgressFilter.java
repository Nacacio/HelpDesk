/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.util;
import java.io.IOException;
 
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
 
import org.springframework.web.filter.OncePerRequestFilter;
 
public class UploadProgressFilter 
    extends OncePerRequestFilter
{
    private final String PROGRESS_TAIL = ".progress"; 
     
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestUri = request.getRequestURI();
         
        String originalUrl = requestUri.substring(0, 
                requestUri.length() - PROGRESS_TAIL.length());
         
        String attributeName = ProgressCapableMultipartResolver.PROGRESS_PREFIX 
            + originalUrl;
         
        Object progress = request.getSession().getAttribute(attributeName);
        if (progress != null) {
            ProgressDescriptor descriptor = (ProgressDescriptor)progress; 
            response.getOutputStream().write( 
                    descriptor.toString().getBytes() );
        }
    }
}