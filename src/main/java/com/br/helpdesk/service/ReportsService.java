package com.br.helpdesk.service;

import com.Consts;
import com.br.helpdesk.model.Category;
import com.br.helpdesk.model.CategoryContainer;
import com.br.helpdesk.model.Client;
import com.br.helpdesk.model.ClientContainer;
import com.br.helpdesk.model.ConsolidatedPerMonthContainer;
import com.br.helpdesk.model.GraphicContainer;
import com.br.helpdesk.model.HighlightCurrentContainer;
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
     * @param idUser
     * @param tickets
     * @param dateFrom
     * @param dateTo
     * @param unit
     * @param type
     * @param response
     * @return
     * @throws UnsupportedEncodingException
     */
    public String getGraphic(String username, long idUser, String tickets, Date dateFrom, Date dateTo, String unit, String type, HttpServletResponse response) throws UnsupportedEncodingException {
        String resultado = "";
        if (type.equals(Consts.CLIENT)) {
            resultado = getGraphicClient(username, tickets, dateFrom, dateTo, unit);
        } else if (type.equals(Consts.CATEGORY)) {
            resultado = getGraphicCategory(username, tickets, dateFrom, dateTo, unit);
        } else if (type.equals(Consts.USER)) {
            resultado = getGraphicUser(idUser, dateFrom, dateTo, unit);
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
        Format formatter = new SimpleDateFormat(Consts.SIMPLE_DATE_FORMAT);
        String currentDayString;

        List<Ticket> listTicket;
        List<GraphicContainer> listGraphicContainer = null;
        GraphicContainer graphicContainer = null;
        List<CategoryContainer> listCategoryContainer = null;
        CategoryContainer categoryContainer = null;
        List<Category> listCategory = null;

        int yearTemp = 0;
        int monthTemp = 0;
        int dayTemp = 0;

        if (tickets.equals(Consts.CREATED)) {
            listTicket = ticketService.findBetweenStartDate(dateFrom, dateTo);
        } else {
            listTicket = ticketService.findBetweenEndDate(dateFrom, dateTo);
        }

        listCategory = (List) categoryService.findAll();

        for (long i = (dateFrom.getTime() + 86400000); i < (dateTo.getTime() + 86400000); i += 86400000) {

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
                    if (tickets.equals(Consts.CREATED)) {
                        yearTemp = ticketTemp.getStartDate().getYear();
                        monthTemp = ticketTemp.getStartDate().getMonth();
                        dayTemp = ticketTemp.getStartDate().getDate();
                        
                        if (yearTemp == currentDay.getYear() && monthTemp == currentDay.getMonth() && dayTemp == currentDay.getDate()) {
                            if (ticketTemp.getCategory().getId().equals(categoryTemp.getId())) {
                                quantTickets++;
                            }
                        }
                    } else {
                        yearTemp = ticketTemp.getEndDate().getYear();
                        monthTemp = ticketTemp.getEndDate().getMonth();
                        dayTemp = ticketTemp.getEndDate().getDate();

                        if (yearTemp == currentDay.getYear() && monthTemp == currentDay.getMonth() && dayTemp == currentDay.getDate()) {
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

        resultado = getJsonGraphic(listGraphicContainer, unit, Consts.CATEGORY);

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
        Format formatter = new SimpleDateFormat(Consts.SIMPLE_DATE_FORMAT);
        String currentDayString;

        List<Ticket> listTicket;
        List<GraphicContainer> listGraphicContainer = null;
        GraphicContainer graphicContainer = null;
        List<ClientContainer> listClientContainer = null;
        ClientContainer clientContainer = null;
        List<Client> listClient = null;

        int yearTemp = 0;
        int monthTemp = 0;
        int dayTemp = 0;

        if (tickets.equals(Consts.CREATED)) {
            listTicket = ticketService.findBetweenStartDate(dateFrom, dateTo);
        } else {
            listTicket = ticketService.findBetweenEndDate(dateFrom, dateTo);
        }

        listClient = (List) clientService.findAll();

        for (long i = (dateFrom.getTime() + 86400000); i < (dateTo.getTime() + 86400000); i += 86400000) {

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
                    if (tickets.equals(Consts.CREATED)) {

                        yearTemp = ticketTemp.getStartDate().getYear();
                        monthTemp = ticketTemp.getStartDate().getMonth();
                        dayTemp = ticketTemp.getStartDate().getDate();

                        if (yearTemp == currentDay.getYear() && monthTemp == currentDay.getMonth() && dayTemp == currentDay.getDate()) {
                            if (ticketTemp.getCategory().getId().equals(clientTemp.getId())) {
                                quantTickets++;
                            }
                        }

                    } else {
                        yearTemp = ticketTemp.getEndDate().getYear();
                        monthTemp = ticketTemp.getEndDate().getMonth();
                        dayTemp = ticketTemp.getEndDate().getDate();

                        if (yearTemp == currentDay.getYear() && monthTemp == currentDay.getMonth() && dayTemp == currentDay.getDate()) {
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

        resultado = getJsonGraphic(listGraphicContainer, unit, Consts.CLIENT);

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
            if (type.equals(Consts.CATEGORY)) {
                for (int j = 0; j < temp.getListCategory().size(); j++) {
                    CategoryContainer categoryTemp = temp.getListCategory().get(j);
                    if (j != 0) {
                        resultado += ",";
                    }
                    resultado += "\"" + categoryTemp.getCategory().getName() + "\":" + categoryTemp.getQuantidade() + "";
                }

            } else if (type.equals(Consts.CLIENT)) {
                for (int j = 0; j < temp.getListClient().size(); j++) {
                    ClientContainer clientTemp = temp.getListClient().get(j);
                    if (j != 0) {
                        resultado += ",";
                    }
                    resultado += "\"" + clientTemp.getClient().getName() + "\":" + clientTemp.getQuantidade() + "";
                }
            } else if (type.equals(Consts.USER)) {
                resultado += "\"created\":" + temp.getCreated() + ",\"closed\":" + temp.getClosed() + "";
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
        Format formatter = new SimpleDateFormat(Consts.SIMPLE_DATE_FORMAT);
        Date currentDay;
        String currentDayString;

        List<GraphicContainer> listGraphicCategoryContainerByPeriodicidade;
        GraphicContainer graphicCategoryContainer = null;
        List<CategoryContainer> categoryContainerList = null;

        int periodo = 0;
        String dias = "";
        if (unit.equals(Consts.DAY)) {
            listGraphicCategoryContainerByPeriodicidade = listGraphicCategoryContainer;
        } else if (unit.equals(Consts.WEEK)) {
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
        } else if (unit.equals(Consts.MONTH)) {
            periodo = 30;
        } else if (unit.equals(Consts.YEAR)) {
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
     * Gera JSON com os campos para o combobox de consolidados por mês nas telas
     * de relatórios.
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
     * Gera JSON para o datagrid de consolidados por mês no relatório de
     * categoria.
     * @param period
     * @param type
     * @param idUser
     * @param response
     * @return
     */
    public String getGridConsolidatedPerMonth(String period, String type, long idUser, HttpServletResponse response) {
        String resultado = "";

        List<Category> listCategory;
        List<Client> listClient;
        List<Integer> date = new ArrayList<Integer>();
        Calendar dateAtual = new GregorianCalendar();
        dateAtual.setTime(new Date());
        Date dateTemp;
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

        if (type.equals(Consts.CATEGORY)) {
            listCategory = (List) categoryService.findAll();
            for (Category temp : listCategory) {

                openFrom = (ticketService.findIsOpenUntilDateAndCategorySomeAlreadyClosed(from.getTime(), temp.getId()));
                created = (ticketService.findBetweenStartDateAndCategory(from.getTime(), to.getTime(), temp.getId()));
                closed = (ticketService.findBetweenEndDateAndCategory(from.getTime(), to.getTime(), temp.getId()));
                openTo = (ticketService.findIsOpenUntilDateAndCategory(to.getTime(), temp.getId()));

                consolidatedTemp = new ConsolidatedPerMonthContainer();
                consolidatedTemp.setClosed(closed.size());
                consolidatedTemp.setCreated(created.size());
                consolidatedTemp.setDate(Integer.toString(date.get(0)) + "-" + Integer.toString(date.get(1)) + "-" + Integer.toString(date.get(3)));
                consolidatedTemp.setOpenFrom(openFrom.size());
                consolidatedTemp.setDateOpenFrom(from.getTime());
                consolidatedTemp.setOpenTo(openTo.size());
                consolidatedTemp.setDateOpenTo(to.getTime());
                consolidatedTemp.setName(temp.getName());

                listConsolidated.add(consolidatedTemp);
            }
        } else if (type.equals(Consts.CLIENT)) {
            listClient = (List) clientService.findAll();

            for (Client temp : listClient) {
                openFrom = (ticketService.findIsOpenUntilDateAndClientSomeAlreadyClosed(from.getTime(), temp.getId()));
                created = (ticketService.findBetweenStartDateAndClient(from.getTime(), to.getTime(), temp.getId()));
                closed = (ticketService.findBetweenEndDateAndClient(from.getTime(), to.getTime(), temp.getId()));
                openTo = (ticketService.findIsOpenUntilDateAndClient(to.getTime(), temp.getId()));

                consolidatedTemp = new ConsolidatedPerMonthContainer();
                consolidatedTemp.setClosed(closed.size());
                consolidatedTemp.setCreated(created.size());
                consolidatedTemp.setDate(Integer.toString(date.get(0)) + "-" + Integer.toString(date.get(1)) + "-" + Integer.toString(date.get(3)));
                consolidatedTemp.setOpenFrom(openFrom.size());
                consolidatedTemp.setDateOpenFrom(from.getTime());
                consolidatedTemp.setOpenTo(openTo.size());
                consolidatedTemp.setDateOpenTo(to.getTime());
                consolidatedTemp.setName(temp.getName());

                listConsolidated.add(consolidatedTemp);
            }
        } else if (type.equals(Consts.USER)) {
            User user = userService.findById(idUser);

            openFrom = (ticketService.findIsOpenUntilDateAndUser(from.getTime(), user.getId()));
            consolidatedTemp = new ConsolidatedPerMonthContainer();
            consolidatedTemp.setName(Consts.OPEN_FROM);
            consolidatedTemp.setValue(openFrom.size());
            consolidatedTemp.setDateOpenFrom(from.getTime());
            consolidatedTemp.setDateOpenTo(to.getTime());
            listConsolidated.add(consolidatedTemp);

            created = (ticketService.findBetweenStartDateAndUser(from.getTime(), to.getTime(), user.getId()));
            consolidatedTemp = new ConsolidatedPerMonthContainer();
            consolidatedTemp.setName(Consts.CREATED_EN);
            consolidatedTemp.setValue(created.size());
            consolidatedTemp.setDateOpenFrom(from.getTime());
            consolidatedTemp.setDateOpenTo(to.getTime());
            listConsolidated.add(consolidatedTemp);

            closed = (ticketService.findBetweenEndDateAndUser(from.getTime(), to.getTime(), user.getId()));
            consolidatedTemp = new ConsolidatedPerMonthContainer();
            consolidatedTemp.setName(Consts.CLOSED_EN);
            consolidatedTemp.setValue(closed.size());
            consolidatedTemp.setDateOpenFrom(from.getTime());
            consolidatedTemp.setDateOpenTo(to.getTime());
            listConsolidated.add(consolidatedTemp);

            openTo = (ticketService.findIsOpenUntilDateAndUser(to.getTime(), user.getId()));
            consolidatedTemp = new ConsolidatedPerMonthContainer();
            consolidatedTemp.setName(Consts.OPEN_TO);
            consolidatedTemp.setValue(openTo.size());
            consolidatedTemp.setDateOpenFrom(from.getTime());
            consolidatedTemp.setDateOpenTo(to.getTime());
            listConsolidated.add(consolidatedTemp);
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
        Format formatter = new SimpleDateFormat(Consts.SIMPLE_DATE_FORMAT_MONTH);
        for (int i = 0; i < list.size(); i++) {
            if (i != 0) {
                resultado += ",";
            }
            resultado += "{\"name\":\"" + list.get(i).getName()
                    + "\",\"openFrom\":\"" + list.get(i).getOpenFrom()
                    + "\",\"dateOpenFrom\":\"" + formatter.format(list.get(i).getDateOpenFrom())
                    + "\",\"created\":\"" + list.get(i).getCreated()
                    + "\",\"closed\":\"" + list.get(i).getClosed()
                    + "\",\"openTo\":\"" + list.get(i).getOpenTo()
                    + "\",\"dateOpenTo\":\"" + formatter.format(list.get(i).getDateOpenTo())
                    + "\",\"value\":\"" + list.get(i).getValue() + "\"}";
        }
        return resultado;
    }

    /**
     * @author andresulivam
     *
     * Gera JSON para os destaques atuais na tela de relatórios de categoria.
     *
     * @return
     */
    public String getHighlightCurrentCategory() {
        String resultado = "";
        List<Category> listCategory = (List) categoryService.findAll();
        List<Ticket> listTicket = ticketService.findByIsOpen(true);
        List<HighlightCurrentContainer> list = new ArrayList<HighlightCurrentContainer>();
        HighlightCurrentContainer highLightTemp;

        highLightTemp = new HighlightCurrentContainer();
        highLightTemp.setValue(listCategory.size());
        highLightTemp.setText(Consts.HABILITADED_CATEGORIES);
        list.add(highLightTemp);

        int cont = 0;

        for (Category temp : listCategory) {
            for (Ticket ticketTemp : listTicket) {
                if (ticketTemp.getCategory().getId().equals(temp.getId())) {
                    cont++;
                }
            }
            if (cont > 0) {
                highLightTemp = new HighlightCurrentContainer();
                highLightTemp.setValue(cont);
                highLightTemp.setText(Consts.IN_CATEGORY + temp.getName());
                list.add(highLightTemp);
            }
            cont = 0;
        }
        resultado = getJsonHighlightCurrent(list);
        return resultado;
    }

    /**
     * @author andresulivam
     *
     * Converte list no JSON para destaques atuais.
     * @param list
     * @return
     */
    public String getJsonHighlightCurrent(List<HighlightCurrentContainer> list) {
        String resultado = "";

        for (int i = 0; i < list.size(); i++) {
            if (i != 0) {
                resultado += ",";
            }
            resultado += "{\"value\":\"" + list.get(i).getValue()
                    + "\",\"text\":\"" + list.get(i).getText() + "\"}";
        }
        return resultado;
    }

    /**
     * @author andresulivam
     *
     * Gera JSON para os destaques atuais na tela de relatórios de clientes.
     *
     * @return
     */
    public String getHighlightCurrentClient() {
        String resultado = "";
        List<Client> listClient = (List) clientService.findAll();
        List<Ticket> listTicket = ticketService.findByIsOpen(true);
        List<HighlightCurrentContainer> list = new ArrayList<HighlightCurrentContainer>();
        HighlightCurrentContainer highLightTemp;

        highLightTemp = new HighlightCurrentContainer();
        highLightTemp.setValue(listClient.size());
        highLightTemp.setText(Consts.REGISTERED_CLIENTS);
        list.add(highLightTemp);

        int cont = 0;

        for (Client temp : listClient) {
            for (Ticket ticketTemp : listTicket) {
                if (ticketTemp.getClient().getId().equals(temp.getId())) {
                    cont++;
                }
            }
            if (cont > 0) {
                highLightTemp = new HighlightCurrentContainer();
                highLightTemp.setValue(cont);
                highLightTemp.setText(Consts.TICKETS_OPEN_OF_CLIENT + temp.getName());
                list.add(highLightTemp);
            }
            cont = 0;
        }
        resultado = getJsonHighlightCurrent(list);
        return resultado;
    }

    public String getGraphicUser(long idUser, Date dateFrom, Date dateTo, String unit) throws UnsupportedEncodingException {

        User user = userService.findById(idUser);
        String resultado = "";
        List<GraphicContainer> listGraphicContainer = null;
        GraphicContainer graphicContainer = null;
        Date currentDay;
        Format formatter = new SimpleDateFormat(Consts.SIMPLE_DATE_FORMAT);
        String currentDayString;
        List<Ticket> ticketsCreated;
        List<Ticket> ticketsClosed;
        int quantTickets = 0;

        int yearTemp = 0;
        int monthTemp = 0;
        int dayTemp = 0;

        ticketsCreated = ticketService.findBetweenStartDate(dateFrom, dateTo);
        ticketsClosed = ticketService.findBetweenEndDate(dateFrom, dateTo);

        for (long i = (dateFrom.getTime() + 86400000); i < (dateTo.getTime() + 86400000); i += 86400000) {
            if (listGraphicContainer == null) {
                listGraphicContainer = new ArrayList<GraphicContainer>();
            }
            graphicContainer = new GraphicContainer();
            currentDay = new Date(i);
            currentDayString = formatter.format(currentDay);
            graphicContainer.setDate(currentDay);
            graphicContainer.setDateString(currentDayString);

            for (Ticket temp : ticketsCreated) {
                if (temp.getUser().getId().equals(user.getId())) {
                    yearTemp = temp.getStartDate().getYear();
                    monthTemp = temp.getStartDate().getMonth();
                    dayTemp = temp.getStartDate().getDate();

                    if (yearTemp == currentDay.getYear() && monthTemp == currentDay.getMonth() && dayTemp == currentDay.getDate()) {
                        quantTickets++;
                    }
                }
            }
            graphicContainer.setCreated(quantTickets);
            quantTickets = 0;
            for (Ticket temp : ticketsClosed) {
                if (temp.getUser().getId().equals(user.getId())) {
                    yearTemp = temp.getEndDate().getYear();
                    monthTemp = temp.getEndDate().getMonth();
                    dayTemp = temp.getEndDate().getDate();
                    if (yearTemp == currentDay.getYear() && monthTemp == currentDay.getMonth() && dayTemp == currentDay.getDate()) {
                        quantTickets++;
                    }
                    quantTickets++;
                }
            }
            graphicContainer.setClosed(quantTickets);
            quantTickets = 0;
            listGraphicContainer.add(graphicContainer);
        }

        resultado = getJsonGraphic(listGraphicContainer, unit, Consts.USER);

        return resultado;
    }

}
