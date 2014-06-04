package com.br.helpdesk.service;

import com.br.helpdesk.model.Category;
import com.br.helpdesk.model.CategoryContainer;
import com.br.helpdesk.model.Client;
import com.br.helpdesk.model.ClientContainer;
import com.br.helpdesk.model.ConsolidatedPerMonthContainer;
import com.br.helpdesk.model.GraphicContainer;
import com.br.helpdesk.model.MonthContainer;
import com.br.helpdesk.model.Ticket;
import com.br.helpdesk.model.User;
import java.io.UnsupportedEncodingException;
import java.text.DateFormatSymbols;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public class ReportsService {

    @Resource
    private UserService userService;

    @Resource
    private TicketService ticketService;

    @Resource
    private CategoryService categoryService;

    @Resource
    private ClientService clientService;

    public void setCategoryService(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    public void setTicketService(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    /**
     * @author andresulivam
     * 
     * Gera o JSON para preencher o gráfico de categorias ou de clientes.
     * 
     * @param username
     * @param tickets
     * @param dateFrom
     * @param dateTo
     * @param unit
     * @param isClient
     * @param response
     * @return
     * @throws UnsupportedEncodingException 
     */
    public String getGraphic(String username, String tickets, Date dateFrom, Date dateTo, String unit, boolean isClient, HttpServletResponse response) throws UnsupportedEncodingException {
        String resultado = "";
        if (isClient) {
            resultado = getGraphicClient(username, tickets, dateFrom, dateTo, unit);
        } else {
            resultado = getGraphicCategory(username, tickets, dateFrom, dateTo, unit);
        }
        return resultado;
    }

    /**
     * @author andresulivam
     * 
     * Gera o JSON para o gráfico de evolução de tickets por categoria.
     * 
     * @param username
     * @param tickets
     * @param dateFrom
     * @param dateTo
     * @param unit
     * @return
     * @throws UnsupportedEncodingException 
     */
    public String getGraphicCategory(String username, String tickets, Date dateFrom, Date dateTo, String unit) throws UnsupportedEncodingException {

        String resultado = "";
        Date currentDay;
        int quantTickets = 0;
        Format formatter = new SimpleDateFormat("yyyy-MM-dd");
        String currentDayString;

        List<Ticket> listTicket;
        List<GraphicContainer> listGraphicContainer = null;
        GraphicContainer graphicContainer = null;
        List<CategoryContainer> listCategoryContainer = null;
        CategoryContainer categoryContainer = null;
        List<Category> listCategory = null;

        if (tickets.equals("Criados")) {
            listTicket = ticketService.findBetweenStartDate(dateFrom, dateTo);
        } else {
            listTicket = ticketService.findBetweenEndDate(dateFrom, dateTo);
        }

        listCategory = (List) categoryService.findAll();

        for (long i = dateFrom.getTime(); i < (dateTo.getTime() + 86400000); i += 86400000) {

            if (listGraphicContainer == null) {
                listGraphicContainer = new ArrayList<GraphicContainer>();
            }

            graphicContainer = new GraphicContainer();
            currentDay = new Date(i);
            currentDayString = formatter.format(currentDay);
            graphicContainer.setDate(currentDay);
            graphicContainer.setDateString(currentDayString);

            for (Category categoryTemp : listCategory) {
                if (listCategoryContainer == null) {
                    listCategoryContainer = new ArrayList<CategoryContainer>();
                }
                categoryContainer = new CategoryContainer();
                categoryContainer.setCategory(categoryTemp);

                for (Ticket ticketTemp : listTicket) {
                    if (tickets.equals("Criados")) {
                        if (ticketTemp.getStartDate().getTime() == currentDay.getTime()) {
                            if (ticketTemp.getCategory().getId().equals(categoryTemp.getId())) {
                                quantTickets++;
                            }
                        }
                    } else {
                        if (ticketTemp.getEndDate().getTime() == currentDay.getTime()) {
                            if (ticketTemp.getCategory().getId().equals(categoryTemp.getId())) {
                                quantTickets++;
                            }
                        }
                    }
                }
                categoryContainer.setQuantidade(quantTickets);
                quantTickets = 0;
                listCategoryContainer.add(categoryContainer);
            }
            graphicContainer.setListCategory(listCategoryContainer);
            listCategoryContainer = null;
            listGraphicContainer.add(graphicContainer);
        }

        resultado = getJsonGraphic(listGraphicContainer, unit, "category");

        return resultado;
    }

    /**
     * @author andresulivam
     * 
     * Gera o JSON para o gráfico de evolução de tickets por cliente.
     * 
     * @param username
     * @param tickets
     * @param dateFrom
     * @param dateTo
     * @param unit
     * @return
     * @throws UnsupportedEncodingException 
     */
    public String getGraphicClient(String username, String tickets, Date dateFrom, Date dateTo, String unit) throws UnsupportedEncodingException {

        String resultado = "";
        Date currentDay;
        int quantTickets = 0;
        Format formatter = new SimpleDateFormat("yyyy-MM-dd");
        String currentDayString;

        List<Ticket> listTicket;
        List<GraphicContainer> listGraphicContainer = null;
        GraphicContainer graphicContainer = null;
        List<ClientContainer> listClientContainer = null;
        ClientContainer clientContainer = null;
        List<Client> listClient = null;

        if (tickets.equals("Criados")) {
            listTicket = ticketService.findBetweenStartDate(dateFrom, dateTo);
        } else {
            listTicket = ticketService.findBetweenEndDate(dateFrom, dateTo);
        }

        listClient = (List) clientService.findAll();

        for (long i = dateFrom.getTime(); i < (dateTo.getTime() + 86400000); i += 86400000) {

            if (listGraphicContainer == null) {
                listGraphicContainer = new ArrayList<GraphicContainer>();
            }

            graphicContainer = new GraphicContainer();
            currentDay = new Date(i);
            currentDayString = formatter.format(currentDay);
            graphicContainer.setDate(currentDay);
            graphicContainer.setDateString(currentDayString);

            for (Client clientTemp : listClient) {
                if (listClientContainer == null) {
                    listClientContainer = new ArrayList<ClientContainer>();
                }
                clientContainer = new ClientContainer();
                clientContainer.setClient(clientTemp);

                for (Ticket ticketTemp : listTicket) {
                    if (tickets.equals("Criados")) {
                        if (ticketTemp.getStartDate().getTime() == currentDay.getTime()) {
                            if (ticketTemp.getCategory().getId().equals(clientTemp.getId())) {
                                quantTickets++;
                            }
                        }
                    } else {
                        if (ticketTemp.getEndDate().getTime() == currentDay.getTime()) {
                            if (ticketTemp.getCategory().getId().equals(clientTemp.getId())) {
                                quantTickets++;
                            }
                        }
                    }
                }
                clientContainer.setQuantidade(quantTickets);
                quantTickets = 0;
                listClientContainer.add(clientContainer);
            }
            graphicContainer.setListClient(listClientContainer);
            listClientContainer = null;
            listGraphicContainer.add(graphicContainer);
        }

        resultado = getJsonGraphic(listGraphicContainer, unit, "client");

        return resultado;
    }

    /**
     * @author andresulivam
     * 
     * Converte a listGraphicContainer em JSON.
     * 
     * @param listGraphicContainer
     * @param unit
     * @param type
     * @return 
     */
    public String getJsonGraphic(List<GraphicContainer> listGraphicContainer, String unit, String type) {
        String resultado = "";

        for (int i = 0; i < listGraphicContainer.size(); i++) {
            GraphicContainer temp = listGraphicContainer.get(i);
            if (i != 0) {
                resultado += ",";
            }
            resultado += "{\"date\":\"" + temp.getDateString() + "\",";
            if (type.equals("category")) {
                for (int j = 0; j < temp.getListCategory().size(); j++) {
                    CategoryContainer categoryTemp = temp.getListCategory().get(j);
                    if (j != 0) {
                        resultado += ",";
                    }
                    resultado += "\"" + categoryTemp.getCategory().getName() + "\":" + categoryTemp.getQuantidade() + "";
                }

            } else if (type.equals("client")) {
                for (int j = 0; j < temp.getListClient().size(); j++) {
                    ClientContainer clientTemp = temp.getListClient().get(j);
                    if (j != 0) {
                        resultado += ",";
                    }
                    resultado += "\"" + clientTemp.getClient().getName() + "\":" + clientTemp.getQuantidade() + "";
                }
            }
            resultado += "}";
        }
        return resultado;
    }

    /**
     * @author andresulivam
     * 
     * Cria JSON de evolução de tickets por categoria pela periodicidade.
     * 
     * @param listGraphicCategoryContainer
     * @param unit
     * @return 
     */
    public String getJsonGraphicCategoryByUnit(List<GraphicContainer> listGraphicCategoryContainer, String unit) {
        String resultado = "";
        Format formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date currentDay;
        String currentDayString;

        List<GraphicContainer> listGraphicCategoryContainerByPeriodicidade;
        GraphicContainer graphicCategoryContainer = null;
        List<CategoryContainer> categoryContainerList = null;

        int periodo = 0;
        String dias = "";
        if (unit.equals("Dia")) {
            listGraphicCategoryContainerByPeriodicidade = listGraphicCategoryContainer;
        } else if (unit.equals("Semana")) {
            Calendar c = new GregorianCalendar();
            for (GraphicContainer listTemp : listGraphicCategoryContainer) {
                if (graphicCategoryContainer == null) {
                    graphicCategoryContainer = new GraphicContainer();
                    dias = listTemp.getDateString() + "/";
                    categoryContainerList = listTemp.getListCategory();
                }
                c.setTime(listTemp.getDate());
                String diaSemana = getWeekDay(c);
                if (!diaSemana.equals("Domingo")) {

                }
            }
            periodo = 7;
        } else if (unit.equals("Mês")) {
            periodo = 30;
        } else if (unit.equals("Ano")) {
            periodo = 365;
        }

        return resultado;
    }

    /**
     * @author andresulivam
     * 
     * Recupera o dia da semana do parâmetro enviado.
     * 
     * @param cal
     * @return 
     */
    public String getWeekDay(Calendar cal) {
        return new DateFormatSymbols().getWeekdays()[cal.get(Calendar.DAY_OF_WEEK)];
    }

    /**
     * @author andresulivam
     * 
     * Recupera nome do mês baseado no parâmetro enviado.
     * 
     * @param month
     * @return 
     */
    public String getMonth(int month) {
        Calendar cal = new GregorianCalendar();
        cal.set(2011, month, 01);
        return new DateFormatSymbols().getMonths()[cal.get(Calendar.MONTH)];
    }

    /**
     * @author andresulivam
     * 
     * Gera JSON com os campos para o combobox de consolidados por mês nas telas de relatórios.
     * @param response
     * @return 
     */
    public String getFieldsConsolidatedPerMonth(HttpServletResponse response) {

        String resultado = "";
        Calendar c = Calendar.getInstance();
        c.set(2011, Calendar.FEBRUARY, 01);

        Calendar dateAtual = new GregorianCalendar();
        dateAtual.setTime(new Date());

        int month = dateAtual.get(Calendar.MONTH);
        int year = dateAtual.get(Calendar.YEAR);

        List<MonthContainer> listMonths = new ArrayList<MonthContainer>();
        MonthContainer monthContainer;

        boolean someYear = false;
        for (int i = c.get(Calendar.YEAR); i <= dateAtual.get(Calendar.YEAR); i++) {
            if (i == dateAtual.get(Calendar.YEAR)) {
                someYear = true;
            }
            for (int j = 0; j < 12; j++) {
                monthContainer = new MonthContainer();
                if (someYear) {
                    if (j <= dateAtual.get(Calendar.MONTH)) {
                        monthContainer.setName(i + "-" + (j + 1));
                        listMonths.add(monthContainer);
                    }
                } else {
                    monthContainer.setName(i + "-" + (j + 1));
                    monthContainer.setValue(getMonth(j) + " " + i);
                    listMonths.add(monthContainer);
                }
            }
        }

        listMonths = inverseList(listMonths);
        resultado = getJsonConsolidatedPerMonth(listMonths);

        return resultado;
    }

    /**
     * @author andresulivam
     * 
     * Inverte todas as posições da lista.
     * @param list
     * @return 
     */
    public List<MonthContainer> inverseList(List<MonthContainer> list) {
        List<MonthContainer> listResult = new ArrayList<MonthContainer>();
        for (int i = (list.size() - 1); i > 0; i--) {
            listResult.add(list.get(i));
        }
        return listResult;
    }

    /**
     * @author andresulivam
     * 
     * Formata a list enviada por parâmetro em JSON
     * @param list
     * @return 
     */
    public String getJsonConsolidatedPerMonth(List<MonthContainer> list) {
        String resultado = "";

        for (int i = 0; i < list.size(); i++) {
            if (i != 0) {
                resultado += ",";
            }
            resultado += "{\"value\":\"" + list.get(i).getValue() + "\",\"name\":\"" + list.get(i).getName() + "\"}";
        }
        return resultado;
    }

    /**
     * @author andresulivam
     * 
     * Gera JSON para o datagrid de consolidados por mês no relatório de categoria.
     * @param period
     * @param type
     * @param response
     * @return 
     */
    public String getGridConsolidatedPerMonth(String period, String type, HttpServletResponse response) {
        String resultado = "";

        List<Category> listCategory;
        List<Client> listClient;
        List<Integer> date = new ArrayList<Integer>();
        Calendar dateAtual = new GregorianCalendar();
        dateAtual.setTime(new Date());
        List<ConsolidatedPerMonthContainer> listConsolidated = new ArrayList<ConsolidatedPerMonthContainer>();
        ConsolidatedPerMonthContainer consolidatedTemp;

        if (period == null || period.equals("")) {
            date.add(dateAtual.get(Calendar.YEAR));
            date.add(dateAtual.get(Calendar.MONTH));
            date.add(dateAtual.getActualMinimum(Calendar.DAY_OF_MONTH));
            date.add(dateAtual.get(Calendar.DATE));
        } else {
            String[] split = period.split("-");
            int year = Integer.parseInt(split[0]);
            int month = Integer.parseInt(split[1]) - 1;

            if (year == dateAtual.get(Calendar.YEAR) && month == dateAtual.get(Calendar.MONTH)) {
                date.add(dateAtual.get(Calendar.YEAR));
                date.add(dateAtual.get(Calendar.MONTH));
                date.add(dateAtual.getActualMinimum(Calendar.DAY_OF_MONTH));
                date.add(dateAtual.get(Calendar.DATE));
            } else {
                dateAtual.set(year, month, 01);
                date.add(dateAtual.get(Calendar.YEAR));
                date.add(dateAtual.get(Calendar.MONTH));
                date.add(dateAtual.getActualMinimum(Calendar.DAY_OF_MONTH));
                date.add(dateAtual.getActualMaximum(Calendar.DAY_OF_MONTH));
            }
        }
        List<Ticket> openFrom, created, closed, openTo;
        Calendar from = Calendar.getInstance();
        from.set(date.get(0), date.get(1), date.get(2));

        Calendar to = Calendar.getInstance();
        to.set(date.get(0), date.get(1), date.get(3));

        if (type.equals("category")) {
            listCategory = (List) categoryService.findAll();
            for (Category temp : listCategory) {
                openFrom = (ticketService.findIsOpenUntilDate(from.getTime()));
                for (int j = 0; j < openFrom.size(); j++) {
                    if (!openFrom.get(j).getCategory().getId().equals(temp.getId())) {
                        openFrom.remove(j);
                        j--;
                    }
                }
                openTo = (ticketService.findIsOpenUntilDate(to.getTime()));
                for (int j = 0; j < openTo.size(); j++) {
                    if (!openTo.get(j).getCategory().getId().equals(temp.getId())) {
                        openTo.remove(j);
                        j--;
                    }
                }
                created = (ticketService.findBetweenStartDate(from.getTime(), to.getTime()));
                for (int j = 0; j < created.size(); j++) {
                    if (!created.get(j).getCategory().getId().equals(temp.getId())) {
                        created.remove(j);
                        j--;
                    }
                }
                closed = (ticketService.findBetweenEndDate(from.getTime(), to.getTime()));
                for (int j = 0; j < closed.size(); j++) {
                    if (!closed.get(j).getCategory().getId().equals(temp.getId())) {
                        closed.remove(j);
                        j--;
                    }
                }

                consolidatedTemp = new ConsolidatedPerMonthContainer();
                consolidatedTemp.setClosed(closed.size());
                consolidatedTemp.setCreated(created.size());
                consolidatedTemp.setDate(Integer.toString(date.get(0)) + "-" + Integer.toString(date.get(1)) + "-" + Integer.toString(date.get(3)));
                consolidatedTemp.setOpenFrom(openFrom.size());
                consolidatedTemp.setOpenTo(openTo.size());
                consolidatedTemp.setName(temp.getName());

                listConsolidated.add(consolidatedTemp);
            }
        } else if (type.equals("client")) {
            listClient = (List) clientService.findAll();

            for (Client temp : listClient) {
                openFrom = (ticketService.findIsOpenUntilDate(from.getTime()));
                for (int j = 0; j < openFrom.size(); j++) {
                    if (!openFrom.get(j).getClient().getId().equals(temp.getId())) {
                        openFrom.remove(j);
                        j--;
                    }
                }
                openTo = (ticketService.findIsOpenUntilDate(to.getTime()));
                for (int j = 0; j < openTo.size(); j++) {
                    if (!openTo.get(j).getClient().getId().equals(temp.getId())) {
                        openTo.remove(j);
                        j--;
                    }
                }
                created = (ticketService.findBetweenStartDate(from.getTime(), to.getTime()));
                for (int j = 0; j < created.size(); j++) {
                    if (!created.get(j).getClient().getId().equals(temp.getId())) {
                        created.remove(j);
                        j--;
                    }
                }
                closed = (ticketService.findBetweenEndDate(from.getTime(), to.getTime()));
                for (int j = 0; j < closed.size(); j++) {
                    if (!closed.get(j).getClient().getId().equals(temp.getId())) {
                        closed.remove(j);
                        j--;
                    }
                }

                consolidatedTemp = new ConsolidatedPerMonthContainer();
                consolidatedTemp.setClosed(closed.size());
                consolidatedTemp.setCreated(created.size());
                consolidatedTemp.setDate(Integer.toString(date.get(0)) + "-" + Integer.toString(date.get(1)) + "-" + Integer.toString(date.get(3)));
                consolidatedTemp.setOpenFrom(openFrom.size());
                consolidatedTemp.setOpenTo(openTo.size());
                consolidatedTemp.setName(temp.getName());

                listConsolidated.add(consolidatedTemp);
            }
        }

        resultado = getJsonGridConsolidatedPerMonth(listConsolidated);
        return resultado;
    }

    /**
     * @author andresulivam
     * 
     * Converte list no JSON para consolidados por mês na tela de categoria.
     * @param list
     * @return 
     */
    public String getJsonGridConsolidatedPerMonth(List<ConsolidatedPerMonthContainer> list) {
        String resultado = "";

        for (int i = 0; i < list.size(); i++) {
            if (i != 0) {
                resultado += ",";
            }
            resultado += "{\"name\":\"" + list.get(i).getName()
                    + "\",\"closed\":\"" + list.get(i).getClosed()
                    + "\",\"created\":\"" + list.get(i).getCreated()
                    + "\",\"openFrom\":\"" + list.get(i).getOpenFrom()
                    + "\",\"openTo\":\"" + list.get(i).getOpenTo() + "\"}";
        }
        return resultado;
    }

}
