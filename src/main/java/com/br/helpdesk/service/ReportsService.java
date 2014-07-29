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
        if (type.equals(Consts.CATEGORY)) {
            resultado = getGraphicCategory(username, tickets, dateFrom, dateTo, unit);
        } else if (type.equals(Consts.CLIENT)) {
            resultado = getGraphicClient(username, tickets, dateFrom, dateTo, unit);
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

        listGraphicContainer = getByUnit(listGraphicContainer, unit);

        for (int i = 0; i < listGraphicContainer.size(); i++) {
            GraphicContainer temp = listGraphicContainer.get(i);
            if (i != 0) {
                resultado += ",";
            }
            resultado += "{\"date\":\"" + temp.getDateString() + "\",";
            if (type.equals(Consts.CATEGORY)) {
                if (temp.getListCategory() != null && temp.getListCategory().size() > 0) {
                    for (int j = 0; j < temp.getListCategory().size(); j++) {
                        CategoryContainer categoryTemp = temp.getListCategory().get(j);
                        if (j != 0) {
                            resultado += ",";
                        }
                        resultado += "\"" + categoryTemp.getCategory().getName() + "\":" + categoryTemp.getQuantidade() + "";
                    }
                }
            } else if (type.equals(Consts.CLIENT)) {
                if (temp.getListClient() != null && temp.getListClient().size() > 0) {
                    for (int j = 0; j < temp.getListClient().size(); j++) {
                        ClientContainer clientTemp = temp.getListClient().get(j);
                        if (j != 0) {
                            resultado += ",";
                        }
                        resultado += "\"" + clientTemp.getClient().getName() + "\":" + clientTemp.getQuantidade() + "";
                    }
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
     *
     * @param listGraphicContainer
     * @param unit
     * @return
     */
    public List<GraphicContainer> getByUnit(List<GraphicContainer> listGraphicContainer, String unit) {
        List<GraphicContainer> resultado = new ArrayList<GraphicContainer>();

        if (!unit.equals(Consts.DAY)) {
            resultado = getlistGraphicContainerByUnit(listGraphicContainer, unit);
        } else {
            resultado = listGraphicContainer;
        }

        return resultado;
    }

    public List<GraphicContainer> getlistGraphicContainerByUnit(List<GraphicContainer> listGraphicContainer, String unit) {
        List<GraphicContainer> resultado = new ArrayList<GraphicContainer>();

        if (listGraphicContainer.size() > 0) {
            // numero de dias que faltam para terminar a semana do primeiro dia da lista.
            int days = 0;
            int valueTofinishGroup = 0;
            String dateResult = "";
            String dayInicial = "";
            String dayLast = "";

            if (unit.equals(Consts.WEEK)) {
                days = getLeftDaysToFinishAWeek(listGraphicContainer.get(0));
                valueTofinishGroup = 7;
            } else if (unit.equals(Consts.MONTH)) {
                days = getLeftDaysToFinishAMonth(listGraphicContainer.get(0)) + 1;
            } else if (unit.equals(Consts.YEAR)) {
                days = getLeftDaysToFinishAYear(listGraphicContainer.get(0));
                valueTofinishGroup = 365;
            }

            GraphicContainer graphicTemp = new GraphicContainer();
            int currentDay = 0;

            List<List<CategoryContainer>> listCategoryContainers = new ArrayList<List<CategoryContainer>>();
            List<List<ClientContainer>> listClientContainers = new ArrayList<List<ClientContainer>>();
            int created = 0;
            int closed = 0;
            int testPosition = 0;

            if (days > 0) {
                // cálculo para o primeiro grupo baseado no dia inicial da lista.
                for (int i = 0; i < days; i++) {
                    if (i < listGraphicContainer.size()) {

                        testPosition = i;

                        if (testPosition == 0) {
                            dayInicial = listGraphicContainer.get(i).getDateString();
                            dayInicial = dayInicial.replaceAll("-", "/");
                        } else if (testPosition == (days - 1)) {
                            dayLast = listGraphicContainer.get(i).getDateString();
                            dayLast = dayLast.replaceAll("-", "/");
                        }

                        if (listGraphicContainer.get(i).getListCategory() != null) {
                            listCategoryContainers.add(listGraphicContainer.get(i).getListCategory());
                        } else if (listGraphicContainer.get(i).getListClient() != null) {
                            listClientContainers.add(listGraphicContainer.get(i).getListClient());
                        } else {
                            created += listGraphicContainer.get(i).getCreated();
                            closed += listGraphicContainer.get(i).getClosed();
                        }

                        if (!dayLast.equals("") || !dayInicial.equals("")) {
                            if (unit.equals(Consts.WEEK) && (testPosition == (days - 1))) {
                                dateResult = dayInicial;
                                dateResult += "~";
                                dateResult += dayLast.split("/")[2];
                            } else if (unit.equals(Consts.MONTH)) {
                                dateResult = dayInicial.split("/")[0] +"/"+ dayInicial.split("/")[1];
                            } else if (unit.equals(Consts.YEAR)) {
                                dateResult = dayInicial.split("/")[0];
                            }
                            graphicTemp.setDateString(dateResult);
                        }
                    }
                    currentDay++;
                }
            } else {
                dayInicial = listGraphicContainer.get(days).getDateString();
                dayLast = listGraphicContainer.get(days).getDateString();
                dateResult += dayInicial + "~" + dayLast.split("-")[2];
                dateResult = dateResult.replaceAll("-", "/");

                if (listGraphicContainer.get(days).getListCategory() != null) {
                    listCategoryContainers.add(listGraphicContainer.get(days).getListCategory());
                } else if (listGraphicContainer.get(days).getListClient() != null) {
                    listClientContainers.add(listGraphicContainer.get(days).getListClient());
                } else {
                    created += listGraphicContainer.get(days).getCreated();
                    closed += listGraphicContainer.get(days).getClosed();
                }
                graphicTemp.setDateString(dateResult);
                currentDay++;
            }

            graphicTemp.setListCategory(sumListCategoryContainer(listCategoryContainers));
            graphicTemp.setListClient(sumListClientContainer(listClientContainers));
            graphicTemp.setCreated(created);
            graphicTemp.setClosed(closed);

            resultado.add(graphicTemp);

            dayLast = "";
            dayInicial = "";
            dateResult = "";
            testPosition = 0;
            created = 0;
            closed = 0;
            int positionTemp = 0;
            int month = 0;
            int dayTemp = 0;
            int lastDay = 0;

            // cálculo para o restante da lista.
            if (currentDay < listGraphicContainer.size()) {
                graphicTemp = new GraphicContainer();
                if (unit.equals(Consts.MONTH)) {
                    // caso seja mensal, verifica o número de dias que falta no mês subsequente ao primeiro grupo criado anteriormente
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(listGraphicContainer.get(currentDay).getDate());
                    dayTemp = cal.get(Calendar.DAY_OF_MONTH);
                    lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
                    valueTofinishGroup = (lastDay - dayTemp) + 1;
                    month = cal.get(Calendar.MONTH);
                }

                for (int i = currentDay; i < listGraphicContainer.size(); i++) {                    
                    
                    if (testPosition == 0) {
                        dayInicial = listGraphicContainer.get(i).getDateString();
                        dayInicial = dayInicial.replaceAll("-", "/");
                    } else if ((testPosition +1) == valueTofinishGroup || (i + 1) == listGraphicContainer.size()) {
                        dayLast = listGraphicContainer.get(i).getDateString();
                        dayLast = dayLast.replaceAll("-", "/");                        
                    }
                    testPosition++;
                    
                    if (unit.equals(Consts.MONTH)) {
                        // verifica se trocou o mês corrente comparado ao mês anterior e atualiza o valor de dias para completar o mês
                        Calendar cal = Calendar.getInstance();
                        cal.setTime(listGraphicContainer.get(i).getDate());
                        int monthTemp = cal.get(Calendar.MONTH);
                        if (monthTemp != month) {
                            month = monthTemp;
                            dayTemp = cal.get(Calendar.DAY_OF_MONTH);
                            lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
                            valueTofinishGroup = (lastDay - dayTemp) + 1;
                        }
                    }
                    positionTemp++;
                    if (listGraphicContainer.get(i).getListCategory() != null) {
                        listCategoryContainers.add(listGraphicContainer.get(i).getListCategory());
                    } else if (listGraphicContainer.get(i).getListClient() != null) {
                        listClientContainers.add(listGraphicContainer.get(i).getListClient());
                    } else {
                        created += listGraphicContainer.get(i).getCreated();
                        closed += listGraphicContainer.get(i).getClosed();
                    }

                    // término de 1 grupo ou a lista estiver no fim
                    if (positionTemp == valueTofinishGroup || (i + 1) == listGraphicContainer.size()) {
                        if (!dayLast.equals("") || !dayInicial.equals("")) {
                            if (unit.equals(Consts.WEEK)) {
                                dateResult = dayInicial;
                                dateResult += "~";
                                dateResult += dayLast.split("/")[2];
                            } else if (unit.equals(Consts.MONTH)) {
                                dateResult = dayInicial.split("/")[0] +"/"+ dayInicial.split("/")[1];
                            } else if (unit.equals(Consts.YEAR)) {
                                dateResult = dayInicial.split("/")[0];
                            }
                            graphicTemp.setDateString(dateResult);
                        }

                        graphicTemp.setListCategory(sumListCategoryContainer(listCategoryContainers));
                        graphicTemp.setListClient(sumListClientContainer(listClientContainers));
                        graphicTemp.setCreated(created);
                        graphicTemp.setClosed(closed);

                        resultado.add(graphicTemp);
                        
                        testPosition = 0;
                        created = 0;
                        closed = 0;
                        dateResult = "";
                        graphicTemp = new GraphicContainer();
                        positionTemp = 0;
                        listCategoryContainers = new ArrayList<List<CategoryContainer>>();
                        listClientContainers = new ArrayList<List<ClientContainer>>();
                    }
                }
            }
        }
        return resultado;
    }

    /**
     * @author andresulivam
     *
     * Método que recebe uma lista de uma lista de CategoryContainer e faz a
     * soma dos mesmos retornando somente uma lista com os valores somados.
     *
     * @param listCategoryContainers
     * @return
     */
    public List<CategoryContainer> sumListCategoryContainer(List<List<CategoryContainer>> listCategoryContainers) {
        List<CategoryContainer> resultado = null;
        if (listCategoryContainers != null && listCategoryContainers.size() > 0) {
            List<CategoryContainer> temp;
            int quantResultado;
            int quantTemp;
            for (List<CategoryContainer> listTemp : listCategoryContainers) {

                if (resultado == null) {
                    // atribuindo a primeira posição da lista ao resultado.
                    resultado = listTemp;
                } else {
                    // a partir da segunda posição da lista, é feito a soma das quantidades das categorias.
                    temp = listTemp;
                    for (CategoryContainer categoryTempResul : resultado) {
                        quantResultado = categoryTempResul.getQuantidade();
                        for (CategoryContainer categoryTempTemp : temp) {
                            quantTemp = categoryTempTemp.getQuantidade();
                            if (categoryTempResul.getCategory().getId().equals(categoryTempTemp.getCategory().getId())) {
                                categoryTempResul.setQuantidade(quantResultado + quantTemp);
                            }
                        }
                    }
                }
            }
        }
        return resultado;
    }

    /**
     * @author andresulivam Método que recebe uma lista de uma lista de
     * CategoryContainer e faz a soma dos mesmos retornando somente uma lista
     * com os valores somados.
     *
     * @param listClientContainers
     * @return
     */
    public List<ClientContainer> sumListClientContainer(List<List<ClientContainer>> listClientContainers) {
        List<ClientContainer> resultado = null;
        if (listClientContainers != null && listClientContainers.size() > 0) {
            List<ClientContainer> temp;
            int quantResultado;
            int quantTemp;
            for (List<ClientContainer> listTemp : listClientContainers) {

                if (resultado == null) {
                    // atribuindo a primeira posição da lista ao resultado.
                    resultado = listTemp;
                } else {
                    // a partir da segunda posição da lista, é feito a soma das quantidades dos clientes.
                    temp = listTemp;
                    for (ClientContainer clientTempResul : resultado) {
                        quantResultado = clientTempResul.getQuantidade();
                        for (ClientContainer clientTempTemp : temp) {
                            quantTemp = clientTempTemp.getQuantidade();
                            if (clientTempResul.getClient().getId().equals(clientTempTemp.getClient().getId())) {
                                clientTempResul.setQuantidade(quantResultado + quantTemp);
                            }
                        }
                    }
                }
            }
        }
        return resultado;
    }

    /**
     * Retorna quantos dias faltam para terminar a semana corrente da data do
     * graphicContainer.
     *
     * @param graphicContainer
     * @return
     */
    public int getLeftDaysToFinishAWeek(GraphicContainer graphicContainer) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(graphicContainer.getDate());
        int day = cal.get(Calendar.DAY_OF_WEEK);
        return 7 - day;
    }

    /**
     * Retorna quantos dias faltam para terminar o mês corrente da data do
     * graphicContainer.
     *
     * @param graphicContainer
     * @return
     */
    public int getLeftDaysToFinishAMonth(GraphicContainer graphicContainer) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(graphicContainer.getDate());
        int day = cal.get(Calendar.DAY_OF_MONTH);
        int lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
        return lastDay - day;
    }

    /**
     * Retorna quantos dias faltam para terminar a semana corrente da data do
     * graphicContainer.
     *
     * @param graphicContainer
     * @return
     */
    public int getLeftDaysToFinishAYear(GraphicContainer graphicContainer) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(graphicContainer.getDate());
        int day = cal.get(Calendar.DAY_OF_YEAR);
        int lastDay = cal.getActualMaximum(Calendar.DAY_OF_YEAR);
        return lastDay - day;
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

        for (long i = dateFrom.getTime(); i < (dateTo.getTime() + 86400000); i += 86400000) {
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
