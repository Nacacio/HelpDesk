/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.br.helpdesk.controller;

import com.br.helpdesk.model.User;
import com.br.helpdesk.repository.CategoryRepository;
import com.br.helpdesk.service.ReportsService;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author rafaelpossas
 */
@Controller
@RequestMapping("/reports")
public class ReportsController {

    @Autowired
    private ReportsService reportsService;

    /**
     * @author andresulivam
     *
     * Requisição do Json para o gráfico de evolução dos tickets por categoria.
     *
     * @param user
     * @param tickets
     * @param dateFrom
     * @param dateTo
     * @param unit
     * @param response
     * @return
     * @throws UnsupportedEncodingException
     */
    @RequestMapping(value = "/getgraphiccategory/{user}", method = RequestMethod.GET, params = {"tickets", "dateFrom", "dateTo", "unit"})
    public @ResponseBody
    String getGraphicCategory(@PathVariable String user,
            @RequestParam(value = "tickets") String tickets,
            @RequestParam(value = "dateFrom") Date dateFrom,
            @RequestParam(value = "dateTo") Date dateTo,
            @RequestParam(value = "unit") String unit,
            HttpServletResponse response) throws UnsupportedEncodingException {
        return reportsService.getGraphic(user, 0, tickets, dateFrom, dateTo, unit, "category", response);
    }

    /**
     * @author andresulivam
     *
     * Requisição do JSON para os dados do combobox de consolidados por mês na
     * tela de relatórios.
     * @param response
     * @return
     * @throws UnsupportedEncodingException
     */
    @RequestMapping(value = "/getfieldsconsolidatedpermonth", method = RequestMethod.GET)
    public @ResponseBody
    String getFieldsConsolidatedPerMonth(HttpServletResponse response) throws UnsupportedEncodingException {
        return reportsService.getFieldsConsolidatedPerMonth(response);
    }

    /**
     * @author andresulivam
     *
     * Requisição do JSON para o datagrid de consolidados por mês por categoria.
     * @param period
     * @param response
     * @return
     * @throws UnsupportedEncodingException
     */
    @RequestMapping(value = "/getgridconsolidatedpermonth", method = RequestMethod.GET, params = {"period"})
    public @ResponseBody
    String getGridConsolidatedPerMonth(@RequestParam(value = "period") String period, HttpServletResponse response) throws UnsupportedEncodingException {
        return reportsService.getGridConsolidatedPerMonth(period, "category", 0, response);
    }

    /**
     * @author andresulivam
     *
     * Requisição do Json para o gráfico de evolução dos tickets por cliente.
     *
     * @param user
     * @param tickets
     * @param dateFrom
     * @param dateTo
     * @param unit
     * @param response
     * @return
     * @throws UnsupportedEncodingException
     */
    @RequestMapping(value = "/getgraphicclient/{user}", method = RequestMethod.GET, params = {"tickets", "dateFrom", "dateTo", "unit"})
    public @ResponseBody
    String getGraphicClient(@PathVariable String user,
            @RequestParam(value = "tickets") String tickets,
            @RequestParam(value = "dateFrom") Date dateFrom,
            @RequestParam(value = "dateTo") Date dateTo,
            @RequestParam(value = "unit") String unit,
            HttpServletResponse response) throws UnsupportedEncodingException {
        return reportsService.getGraphic(user, 0,  tickets, dateFrom, dateTo, unit, "client", response);
    }

    /**
     * @author andresulivam
     *
     * Requisição do JSON para o datagrid de consolidados por mês por cliente.
     * @param period
     * @param response
     * @return
     * @throws UnsupportedEncodingException
     */
    @RequestMapping(value = "/getgridconsolidatedpermonthclient", method = RequestMethod.GET, params = {"period"})
    public @ResponseBody
    String getGridConsolidatedPerMonthClient(@RequestParam(value = "period") String period, HttpServletResponse response) throws UnsupportedEncodingException {
        return reportsService.getGridConsolidatedPerMonth(period, "client", 0, response);
    }

    /**
     * @author andresulivam
     *
     * Requisição do JSON para a tela de destaques atuais na tela de relatórios
     * de categoria.
     *
     * @param response
     * @return
     */
    @RequestMapping(value = "/gethighlightcurrentcategory", method = RequestMethod.GET)
    public @ResponseBody
    String getHighlightCurrentCategory(HttpServletResponse response) {
        return reportsService.getHighlightCurrentCategory();
    }

    /**
     * @author andresulivam
     *
     * Requisição do JSON para a tela de destaques atuais na tela de relatórios
     * de clientes.
     *
     * @param response
     * @return
     */
    @RequestMapping(value = "/gethighlightcurrentclient", method = RequestMethod.GET)
    public @ResponseBody
    String getHighlightCurrentClient(HttpServletResponse response) {
        return reportsService.getHighlightCurrentClient();
    }

    @RequestMapping(value = "/getgraphicuser/{user}", method = RequestMethod.GET, params = {"idUser", "dateFrom", "dateTo", "unit"})
    public @ResponseBody
    String getGraphicUser(@PathVariable String user,
            @RequestParam(value = "idUser") long idUser,
            @RequestParam(value = "dateFrom") Date dateFrom,
            @RequestParam(value = "dateTo") Date dateTo,
            @RequestParam(value = "unit") String unit,
            HttpServletResponse response) throws UnsupportedEncodingException {
        return reportsService.getGraphic(user, idUser, "", dateFrom, dateTo, unit, "user", response);
    }
    
        @RequestMapping(value = "/getgridconsolidatedpermonthuser", method = RequestMethod.GET, params = {"period", "idUser"})
    public @ResponseBody
    String getGridConsolidatedPerUser(@RequestParam(value = "period") String period, @RequestParam(value = "idUser") long idUser, HttpServletResponse response) throws UnsupportedEncodingException {
        return reportsService.getGridConsolidatedPerMonth(period, "user", idUser, response);
    }

}
