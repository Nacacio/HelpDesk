/* 
 * @Author andresulivam
 * 
 * This controller is responsible for controlling the screen of reports. 
 * 
 * Views:
 *    view/reports/Reports.js
 *    view/reports/FormGraphicCategory.js
 *    view/reports/FormPanelUser.js
 *    view/reports/FormConsolidatedPerMonth.js
 */
Ext.define('Helpdesk.controller.Reports', {
    extend: 'Ext.app.Controller',
    views: ['reports.Reports',
        'Helpdesk.view.reports.GraphicCategoryPanel',
        'Helpdesk.view.reports.GraphicClientPanel',
        'Helpdesk.view.reports.FormGraphicCategory',
        'Helpdesk.view.reports.FormPanelUser',
        'Helpdesk.view.reports.FormConsolidatedPerMonth'],
    requires: ['Helpdesk.store.Reports', 'Helpdesk.model.ConsolidatedPerMonthContainer', 'Helpdesk.store.Tickets', 'Helpdesk.util.Dialogs'],
    stores: ['Reports', 'Tickets'],
    init: function() {
        this.control({
            'reportssidemenu button': {
                click: this.onReportsMenuClick
            },
            'formgraphiccategory button#btnFind': {
                click: this.getGraphicCategory
            },
            'formgraphicclient button#btnFindClient': {
                click: this.getGraphicClient
            },
            'formgraphicuser button#btnFindUser': {
                click: this.getGraphicUser
            },
            'graphiccategorypanel formconsolidatedpermonth button': {
                click: this.getGridConsolidatedPerMonth
            },
            'graphicclientpanel formconsolidatedpermonth button': {
                click: this.getGridConsolidatedPerMonthClient
            },
            'graphicuserpanel formconsolidatedpermonth button': {
                click: this.getGridConsolidatedPerMonthUser
            },
            'formpaneluser button#generateReport': {
                click: this.generateReportsUser
            }
        });
    },
    refs: [
        {
            ref: 'cardPanel',
            selector: 'viewport > container#maincardpanel'
        },
        {
            ref: 'mainHeader',
            selector: 'viewport mainheader'
        },
        {
            ref: 'reportsCardContainer',
            selector: 'reports #cardContainer'
        },
        {
            ref: 'reportsSideMenu',
            selector: 'reports > reportssidemenu'
        },
        {
            ref: 'reportsCardPanel',
            selector: 'reports > #reportscardpanel'
        },
        {
            ref: 'graphicCategoryPanel',
            selector: 'reports > #reportscardpanel > reportsbycategory > graphiccategorypanel'
        },
        {
            ref: 'graphicUserPanel',
            selector: 'reports > #reportscardpanel > reportsbyuser > graphicuserpanel'
        },
        {
            ref: 'graphicClientPanel',
            selector: 'reports > #reportscardpanel > reportsbyclient > graphicclientpanel'
        },
        {
            ref: 'mainHeaderSettings',
            selector: '#settings'
        }
    ],
    index: function() {
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.reportsview);
        this.getReportsCardPanel().getLayout().setActiveItem(Helpdesk.Globals.reports_category_view);
        this.getReportsSideMenu().down('#buttonTicketsByCategory').toggle(true);
        this.formatConsolidatedPerMonth();
        this.formatFormsGraphicCategory();
        this.formatHighlightCurrent();

        var mainHeader = this.getMainHeader();
        var btnReports = mainHeader.down("#reports");
        btnReports.toggle(true);
    },
    /**
     * @author andresulivam
     * 
     * Método para fazer a requisição ao servidor para preencher o combobox de meses nos filtros dos datagrids 
     * de consolidados por mês.
     * @returns {undefined}
     */
    formatConsolidatedPerMonth: function() {
        this.getReportsStore().getFieldsConsolidatedPerMonth(this.callbackFieldsConsolidatedPerMonth, this);
    },
    /**
     * @author andresulivam
     * 
     * Seleção do menu lateral dos relatórios.
     * @param {type} btn
     * @returns {undefined}
     */
    onReportsMenuClick: function(btn) {

        if (btn.itemId === 'buttonTicketsByCategory') {
            this.getReportsCardPanel().getLayout().setActiveItem(Helpdesk.Globals.reports_category_view);
            this.formatFormsGraphicCategory();
        }
        else if (btn.itemId === 'buttonTicketsByUser') {
            this.getReportsCardPanel().getLayout().setActiveItem(Helpdesk.Globals.reports_user_view);
            this.formatFormsGraphicUser();
        }
        else if (btn.itemId === 'buttonTicketsByClient') {
            this.getReportsCardPanel().getLayout().setActiveItem(Helpdesk.Globals.reports_client_view);
            this.formatFormsGraphicClient();
        }
        else if (btn.itemId === 'buttonExportData') {
            this.getReportsCardPanel().getLayout().setActiveItem(Helpdesk.Globals.reports_export_view);
        }
    },
    /**
     * @author andresulivam
     * 
     * Formatar tela de relatórios de categoria. Formata gráfico e datagrid.
     * @returns {undefined}
     */
    formatFormsGraphicCategory: function() {
        this.getGraphicCategory();
        this.getGridConsolidatedPerMonth();
    },
    /**
     * @author andresulivam
     * 
     * Formatar tela de relatórios de usuários. Formata gráfico e datagrid. 
     * @returns {undefined}
     */
    formatFormsGraphicUser: function() {
        var graphicUserPanel = this.getGraphicUserPanel();
        var lbl = graphicUserPanel.down('#lblEvolutionTicketsByUser');
        if (lbl.hidden !== true) {
            this.getGraphicUser();
            this.getGridConsolidatedPerMonthUser();
        }
    },
    /**
     * @author andresulivam
     * 
     * Formatar tela de relatórios de clientes. Formata gráfico e datagrid. 
     * @returns {undefined}
     */
    formatFormsGraphicClient: function() {
        this.getGraphicClient();
        this.getGridConsolidatedPerMonthClient();
    },
    /**
     * @author andresulivam
     * 
     * Callback da requisição dos campos do combobox de meses nos filtros de pesquisa.
     * @param {type} result
     * @returns {undefined}
     */
    callbackFieldsConsolidatedPerMonth: function(result) {

        var jsonObj = $.parseJSON('[' + result + ']');
        var graphicCategoryPanel = this.getGraphicCategoryPanel();
        var graphicUserPanel = this.getGraphicUserPanel();
        var graphicClientPanel = this.getGraphicClientPanel();

        // ------------ Referencia para os combobox que usarão os campos do Json de resposta. ----------        
        var panelCategory = graphicCategoryPanel.items.get('panelConsolidatedPerMonth');
        var cmbBoxMonthCategory = panelCategory.down('formconsolidatedpermonth').down('combobox');

        var panelUser = graphicUserPanel.items.get('panelConsolidatedPerMonthUser');
        var cmbBoxMonthUser = panelUser.down('formconsolidatedpermonth').down('combobox');

        var panelClient = graphicClientPanel.items.get('panelConsolidatedPerMonthClient');
        var cmbBoxMonthClient = panelClient.down('formconsolidatedpermonth').down('combobox');
        //---------------------------------------------------------------------------------------------

        // Formatando label que aparecerá para o usuário no combobox.
        for (var i = 0; i < jsonObj.length; i++) {
            var resTokens = jsonObj[i].name.split("-");
            var text = 'MONTH_' + resTokens[1];
            jsonObj[i].value = translations[text] + ' ' + resTokens[0];
            if (i === 0) {
                // acrescentando a String PARCIAL no mês corrente. (Primeiro mês da Lista)
                jsonObj[i].value += ' ' + translations.PARTIAL;
            }
        }

        var store = new Ext.data.ArrayStore({
            extend: 'Helpdesk.store.BasicStore',
            id: 0,
            fields: ['name', 'value'],
            data: jsonObj
        });

        Ext.define('DynamicModel', {
            extend: 'Ext.data.Model',
            fields: ['name', 'value']
        });

        store.loadData([], false);

        for (var i = 0; i < jsonObj.length; i++) {
            var record = Ext.ModelManager.create(jsonObj[i], 'DynamicModel');
            store.add(record);
        }

        cmbBoxMonthCategory.bindStore(store);
        cmbBoxMonthCategory.select(cmbBoxMonthCategory.getStore().getAt(0));

        cmbBoxMonthUser.bindStore(store);
        cmbBoxMonthUser.select(cmbBoxMonthUser.getStore().getAt(0));

        cmbBoxMonthClient.bindStore(store);
        cmbBoxMonthClient.select(cmbBoxMonthClient.getStore().getAt(0));
    },
    /**
     * @author andresulivam
     * 
     * Requisição ao servidor para o Json para o gráfico de categorias na tela de relatórios de categoria.
     * @returns {undefined}
     */
    getGraphicCategory: function() {

        var graphicCategoryPanel = this.getGraphicCategoryPanel();
        var panel = graphicCategoryPanel.items.get('panelEvolutionTicketsByCategory');
        var hboxCategory = panel.down('#formGraphicCategory').down('#hboxCategory');

        var tickets = hboxCategory.down('#cmbTickets').value;
        var dateFieldFrom = hboxCategory.down('#dateFieldFrom');
        var dateFieldTo = hboxCategory.down('#dateFieldTo');
        var unit = hboxCategory.down('#cmbUnit').value;

        var reportsGraphicCategory = graphicCategoryPanel.down('graphiccategory');
        var reportsStore = reportsGraphicCategory.getStore();
        reportsGraphicCategory.surface.removeAll();
        reportsGraphicCategory.setLoading();
        reportsStore.getGraphicCategory(this.callbackGraphicCategory, Helpdesk.Globals.user, this, tickets, dateFieldFrom.value, dateFieldTo.value, unit);
    },
    /**
     * @author andresulivam
     * 
     * Callback da requisição ao servidor do Json para o gráfico de categorias na tela de relatórios de categoria.
     * @param {type} result
     * @returns {undefined}
     */
    callbackGraphicCategory: function(result) {
        this.formatGraphic(result, 'category');
    },
    /**
     * @author andresulivam
     * 
     * Formata gráfico baseado no tipo enviado por parâmetro.
     * 
     * @param {type} result
     * @param {type} type
     * @returns {undefined}
     */
    formatGraphic: function(result, type) {

        var jsonObj = $.parseJSON('[' + result + ']');
        if (jsonObj[0] !== null) {
            var graphicPanel;
            var reportsGraphic;
            if (type === 'category') {
                graphicPanel = this.getGraphicCategoryPanel();
                reportsGraphic = graphicPanel.down('graphiccategory');
            } else if (type === 'client') {
                graphicPanel = this.getGraphicClientPanel();
                reportsGraphic = graphicPanel.down('graphicclient');
            }

            for (var i = 0; i < jsonObj.length; i++) {
                var date = new Date(jsonObj[i].date);
                var dateFormat = date.toLocaleDateString(translations.FORMAT_DATE);
                //jsonObj[i].date = dateFormat;
            }

            var data = jsonObj[0];
            var fields;
            fields = Object.keys(data);

            reportsGraphic.series.clear();

            reportsGraphic.fields = fields;
            reportsGraphic.getStore().fields = fields;
            // criando séries dinâmicamente baseado nos atributos do Json pois cada atributo != 'date' é uma categoria.
            // Exemplo Json: { date='1-1-1990', bug=2, inovation=3, service=2 }
            for (var i = 1; i < fields.length; i++) {
                var newSeries = {
                    type: 'line',
                    highlight: {
                        size: 7,
                        radius: 7
                    },
                    axis: 'left',
                    title: translations[fields[i]],
                    xField: 'date',
                    yField: fields[i],
                    tips: {
                        trackMouse: true,
                        width: 120,
                        height: 80,
                        cls: 'tooltip_graphic',
                        renderer: function(storeItem, item) {
                            this.setTitle(storeItem.get('date'));
                        }
                    },
                    markerConfig: {
                        type: 'cross',
                        size: 4,
                        radius: 4,
                        'stroke-width': 0
                    }
                };
                reportsGraphic.series.add(newSeries);
            }
            ;
            Ext.define('DynamicModel', {
                extend: 'Ext.data.Model',
                fields: fields
            });

            reportsGraphic.getStore().loadData([], false);

            for (var j = 0; j < jsonObj.length; j++) {
                var record = Ext.ModelManager.create(jsonObj[j], 'DynamicModel');
                reportsGraphic.getStore().add(record);
            }

            reportsGraphic.redraw();
        }
    },
    /**
     * @author andresulivam
     * 
     * Requisição ao servidor para o Json para preencher o datagrid de consolidados por mês na tela de relatórios de categoria.
     * @returns {undefined}
     */
    getGridConsolidatedPerMonth: function() {
        var graphicCategoryPanel = this.getGraphicCategoryPanel();
        var panel = graphicCategoryPanel.items.get('panelConsolidatedPerMonth');
        var cmbBoxMonth = panel.down('formconsolidatedpermonth').down('combobox');
        var grid = panel.down('gridconsolidatedpermonth');
        grid.setLoading();
        var period = cmbBoxMonth.getValue();

        if (period === null) {
            period = "";
        }
        this.getReportsStore().getGridConsolidatedPerMonth(this.callbackGridConsolidatedPerMonth, period, this);
    },
    /**
     * @author andresulivam
     * 
     * Callback da requisição do servidor do Json para preencher o datagrid de consolidados por mês na tela de relatórios de categoria.
     * @param {type} result
     * @returns {undefined}
     */
    callbackGridConsolidatedPerMonth: function(result) {
        this.gridConsolidatedPerMonth(result, 'category');
    },
    /**
     * @author andresulivam
     * 
     * Preencher o datagrid referente ao tipo enviado por parâmetro.
     * @param {type} result
     * @param {type} type
     * @returns {undefined}
     */
    gridConsolidatedPerMonth: function(result, type) {
        var jsonObj = $.parseJSON('[' + result + ']');
        var graphicPanel;
        var panel;
        var grid;

        var json = jsonObj[0];

        var date = new Date(json.dateOpenFrom);
        var dateOpenFromFormatted = Ext.util.Format.date(date,translations.DATE_SIMPLIFIED);

        var date = new Date(json.dateOpenTo);
        var dateOpenToFormatted = Ext.util.Format.date(date,translations.DATE_SIMPLIFIED);

        if (type === 'category') {
            graphicPanel = this.getGraphicCategoryPanel();
            panel = graphicPanel.items.get('panelConsolidatedPerMonth');
            grid = panel.down('#containerGrid').down('gridconsolidatedpermonth');
            grid.getView().getHeaderAtIndex(0).setText(translations.CATEGORY);
            grid.getView().getHeaderAtIndex(1).setText(translations.OPEN + ' (' + dateOpenFromFormatted + ')');
            grid.getView().getHeaderAtIndex(4).setText(translations.OPEN + ' (' + dateOpenToFormatted + ')');
        } else if (type === 'client') {
            graphicPanel = this.getGraphicClientPanel();
            panel = graphicPanel.items.get('panelConsolidatedPerMonthClient');
            grid = panel.down('#containerGridClient').down('gridconsolidatedpermonth');
            grid.getView().getHeaderAtIndex(0).setText(translations.CLIENT);
            grid.getView().getHeaderAtIndex(1).setText(translations.OPEN + ' (' + dateOpenFromFormatted + ')');
            grid.getView().getHeaderAtIndex(4).setText(translations.OPEN + ' (' + dateOpenToFormatted + ')');
        } else if (type === 'user') {
            graphicPanel = this.getGraphicUserPanel();
            panel = graphicPanel.items.get('panelConsolidatedPerMonthUser');
            grid = panel.down('#containerGridUser').down('#gridConsolidatedPerMonthUser');
        }
        grid.getStore().removeAll();

        var name;
        var closed = 0;
        var created = 0;
        var openFrom = 0;
        var openTo = 0;

        for (var i = 0; i < jsonObj.length; i++) {
            if (type !== 'client') {
                jsonObj[i].name = translations[jsonObj[i].name];
            }
            var record = Ext.ModelManager.create(jsonObj[i], 'Helpdesk.model.ConsolidatedPerMonthContainer');
            grid.getStore().add(record);
            // calculando a soma dos tickets para após o loop completo, criar o objeto com os valores totais de tickets nas categorias.
            closed += parseInt(record.data.closed);
            created += parseInt(record.data.created);
            openFrom += parseInt(record.data.openFrom);
            openTo += parseInt(record.data.openTo);
        }
        if (type !== 'user') {
            // criando o objeto com os valores totais dos tickets.
            name = translations.TOTAL;
            var total;
            total = Ext.ModelManager.create(total, 'Helpdesk.model.ConsolidatedPerMonthContainer');
            total.data.name = name;
            total.data.closed = closed;
            total.data.created = created;
            total.data.openFrom = openFrom;
            total.data.openTo = openTo;

            grid.getStore().add(total);
        }
        grid.setLoading(false);
    },
    /**
     * @author andresulivam
     * 
     * Método para requisição ao servidor para os destaques atuais para a tela de relatórios de categorias e relatórios de clientes. 
     * @returns {undefined}
     */
    formatHighlightCurrent: function() {
        var reportsStore = this.getReportsStore();

        reportsStore.getHighlightCurrentCategory(this.callbackHighlightCurrentCategory, this);
        reportsStore.getHighlightCurrentClient(this.callbackHighlightCurrentClient, this);
    },
    /**
     * @author andresulivam
     * 
     * Callback da função do get json para o painel de destaques atuais da tela de relatórios por categoria
     * 
     * @param {type} result
     * @returns {undefined}
     */
    callbackHighlightCurrentCategory: function(result) {
        this.formatHighlightCurrentByScreen(result, 'category');
    },
    /**
     * @author andresulivam
     * 
     * Callback da função do get json para o painel de destaques atuais da tela de relatórios por cliente
     * 
     * @param {type} result
     * @returns {undefined}
     */
    callbackHighlightCurrentClient: function(result) {
        this.formatHighlightCurrentByScreen(result, 'client');
    },
    /**
     * @author andresulivam
     * 
     * Formata o painel de destaques atuais baseado na tela enviada por parâmentro (type) e o result (json).
     * 
     * @param {type} result
     * @returns {undefined}
     */
    formatHighlightCurrentByScreen: function(result, type) {
        var jsonObj = $.parseJSON('[' + result + ']');
        var panel;
        var highlightCurrent;
        var container;
        var text;
        var value;
        var label;
        var containerTemp;
        if (type === 'client') {
            panel = this.getGraphicClientPanel();
            highlightCurrent = panel.down('#panelHighLightCurrentClient');
            container = highlightCurrent.down('#containerHighlightCurrentClient');
            for (var i = 0; i < jsonObj.length; i++) {
                value = jsonObj[i].value;
                text = jsonObj[i].text.split(":");
                containerTemp = {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    style: {
                        'padding-bottom': '5px'
                    },
                    items: [
                        {
                            xtype: 'label',
                            text: value,
                            style: {
                                'font-weight': 'bold'
                            },
                            margin: 2
                        },
                        {
                            xtype: 'label',
                            text: translations[text[0]],
                            margin: 2
                        },
                        {
                            xtype: 'label',
                            text: text[1],
                            style: {
                                'font-weight': 'bold'
                            },
                            margin: 2
                        }
                    ]
                };
                container.add(containerTemp);
            }
        } else if (type === 'category') {
            panel = this.getGraphicCategoryPanel();
            highlightCurrent = panel.down('#panelHighLightCurrent');
            container = highlightCurrent.down('#containerHighlightCurrent');
            for (var i = 0; i < jsonObj.length; i++) {
                value = jsonObj[i].value + ' ';
                text = jsonObj[i].text.split(":");
                if (i !== 0) {
                    containerTemp = {
                        xtype: 'container',
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        style: {
                            'padding-bottom': '5px'
                        },
                        items: [
                            {
                                xtype: 'label',
                                text: value,
                                style: {
                                    'font-weight': 'bold'
                                },
                                margin: 2
                            },
                            {
                                xtype: 'label',
                                text: translations[text[0]],
                                margin: 2
                            },
                            {
                                xtype: 'label',
                                style: {
                                    'font-weight': 'bold'
                                },
                                text: translations[text[1]],
                                margin: 2
                            }
                        ]
                    };
                } else if (i === 0) {
                    containerTemp = {
                        xtype: 'container',
                        style: {
                            'padding-bottom': '5px'
                        },
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [
                            {
                                xtype: 'label',
                                text: value,
                                style: {
                                    'font-weight': 'bold'
                                },
                                margin: 2
                            },
                            {
                                xtype: 'label',
                                text: translations[text[0]],
                                margin: 2
                            }
                        ]
                    };
                }
                container.add(containerTemp);
            }
        }

    },
    /**
     * @author andresulivam
     * 
     * Formatar tela de relatórios por usuário. Formata gráfico e datagrid.
     * @returns {undefined}
     */
    generateReportsUser: function() {
        this.getGraphicUser();
        this.getGridConsolidatedPerMonthUser();
    },
    /**
     * @author andresulivam
     * 
     * Requisição ao servidor para o Json para o gráfico de categorias na tela de relatórios de categoria.
     * @returns {undefined}
     */
    getGraphicUser: function() {
        var graphicUserPanel = this.getGraphicUserPanel();
        var panel = graphicUserPanel.down('#formPanelUser');
        var cmbBox = panel.down('usercombobox');

        var panelGraphic = graphicUserPanel.items.get('panelEvolutionTicketsByUser');
        var hboxUser = panelGraphic.down('formgraphicuser').down('#hboxUser');

        var idUser = cmbBox.getValue();
        var dateFieldFrom = hboxUser.down('#dateFieldFromUser');
        var dateFieldTo = hboxUser.down('#dateFieldToUser');
        var unit = hboxUser.down('#cmbUnitUser').value;

        var reportsGraphicUser = graphicUserPanel.down('graphicuser');
        var reportsStore = reportsGraphicUser.getStore();

        reportsStore.getGraphicUser(this.callbackGraphicUser, Helpdesk.Globals.user, this, idUser, dateFieldFrom.value, dateFieldTo.value, unit);
    },
    /**
     * @author andresulivam
     * 
     * Callback do json para preencher o gráfico de evolução de tickets por usuário.
     * 
     * @param {type} result
     * @returns {undefined}
     */
    callbackGraphicUser: function(result) {
        var jsonObj = $.parseJSON('[' + result + ']');
        var graphicUserPanel = this.getGraphicUserPanel();
        var panel = graphicUserPanel.down('#formPanelUser');
        var cmbBox = panel.down('usercombobox');

        var lbl = graphicUserPanel.down('#lblEvolutionTicketsByUser');
        var panelGraphic = graphicUserPanel.down('#panelEvolutionTicketsByUser');
        var panelConsolidated = graphicUserPanel.down('#panelConsolidatedPerMonthUser');

        var reportsGraphicUser = graphicUserPanel.down('graphicuser');

        var data = jsonObj[0];
        var fields = Object.keys(data);

        Ext.define('DynamicModel', {
            extend: 'Ext.data.Model',
            fields: fields
        });

        reportsGraphicUser.getStore().loadData([], false);

        for (var j = 0; j < jsonObj.length; j++) {
            var record = Ext.ModelManager.create(jsonObj[j], 'DynamicModel');
            reportsGraphicUser.getStore().add(record);
        }
        lbl.setText(translations.EVOLUTION_TICKETS_BY_USER + ' ' + cmbBox.rawValue);
        lbl.setVisible(true);
        panelGraphic.setVisible(true);
        panelConsolidated.setVisible(true);

    },
    /**
     * @author andresulivam
     * 
     * Método para requisição ao servidor do Json para o gráfico de clientes na tela de relatórios de clientes.
     * @returns {undefined}
     */
    getGraphicClient: function() {
        var graphicClientPanel = this.getGraphicClientPanel();
        var panel = graphicClientPanel.items.get('panelEvolutionTicketsByClient');
        var hboxClient = panel.down('#formGraphicClient').down('#hboxClient');

        var tickets = hboxClient.down('#cmbTicketsClient').value;
        var dateFieldFrom = hboxClient.down('#dateFieldFromClient');
        var dateFieldTo = hboxClient.down('#dateFieldToClient');
        var unit = hboxClient.down('#cmbUnitClient').value;

        var reportsGraphicClient = graphicClientPanel.down('graphicclient');
        var reportsStore = reportsGraphicClient.getStore();
        reportsGraphicClient.surface.removeAll();
        reportsGraphicClient.setLoading();
        reportsStore.getGraphicClient(this.callbackGraphicClient, Helpdesk.Globals.user, this, tickets, dateFieldFrom.value, dateFieldTo.value, unit);
    },
    /**
     * @author andresulivam
     * 
     * Callback da requisição ao servidor do Json para o gráfico de clientes na tela de relatórios de clientes
     * @param {type} result
     * @returns {undefined}
     */
    callbackGraphicClient: function(result) {
        this.formatGraphic(result, 'client');
    },
    /**
     * @author andresulivam
     * 
     * Requisição ao servidor para o Json para preencher o datagrid de consolidados por mês na tela de relatórios de clientes.
     * @returns {undefined}
     */
    getGridConsolidatedPerMonthClient: function() {
        var graphicClientPanel = this.getGraphicClientPanel();
        var panel = graphicClientPanel.items.get('panelConsolidatedPerMonthClient');
        var cmbBoxMonth = panel.down('formconsolidatedpermonth').down('combobox');
        var grid = panel.down('gridconsolidatedpermonth');
        var period = cmbBoxMonth.getValue();
        grid.setLoading();

        if (period === null) {
            period = "";
        }
        this.getReportsStore().getGridConsolidatedPerMonthClient(this.callbackGridConsolidatedPerMonthClient, period, this);
    },
    /**
     * @author andresulivam
     * 
     * Requisição ao servidor para o json com os dados para o datagrid de relatório de usuário.
     * 
     * @returns {undefined}
     */
    getGridConsolidatedPerMonthUser: function() {
        var graphicUserPanel = this.getGraphicUserPanel();
        var panelUser = graphicUserPanel.items.get('panelConsolidatedPerMonthUser');
        var cmbBoxMonth = panelUser.down('formconsolidatedpermonth').down('combobox');
        var grid = panelUser.down('gridconsolidatedpermonthuser');
        var period = cmbBoxMonth.getValue();

        var panel = graphicUserPanel.down('#formPanelUser');
        var cmbBox = panel.down('usercombobox');
        var idUser = cmbBox.getValue();

        grid.setLoading();

        if (period === null) {
            period = "";
        }
        this.getReportsStore().getGridConsolidatedPerMonthUser(this.callbackGridConsolidatedPerMonthUser, period, idUser, this);
    },
    /**
     * @author andresulivam
     * 
     * Callback da requisição do servidor do Json para preencher o datagrid de consolidados por mês na tela de relatórios de clientes.
     * @param {type} result
     * @returns {undefined}
     */
    callbackGridConsolidatedPerMonthClient: function(result) {
        this.gridConsolidatedPerMonth(result, 'client');
    },
    /**
     * @author andresulivam
     * 
     * Callback da requisição do servidor do Json para preencher o datagrid de consolidados por mês na tela de relatório de usuário.
     * @param {type} result
     * @returns {undefined}
     */
    callbackGridConsolidatedPerMonthUser: function(result) {
        this.gridConsolidatedPerMonth(result, 'user');
    }
});