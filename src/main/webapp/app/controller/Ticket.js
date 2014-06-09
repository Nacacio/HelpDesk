/* 
 * @Author rafaelpossas
 * 
 * This controller is responsible for controlling the menu clicks and window
 * changes of all the ticket views. The view is created by selecting the tab button
 * on the main header of the application. The window that is opened has all its items
 * controlled by this class and therefore will dispatch events that will also be 
 * listened by this class.
 * 
 * Views:
 *    view/ticket/MainPanel.js
 *    view/ticket/Ticket.js
 *    view/ticket/TicketSideMenu.js
 *    view/ticket/TicketSideMenuItem.js
 */
Ext.define('Helpdesk.controller.Ticket', {
    extend: 'Ext.app.Controller',
    views: [
        'ticket.Ticket', 'ticket.NewTicket', 'ticket.TicketDetails', 'ticket.TicketAnswerPanel'
    ],
    stores: ['Tickets', 'TicketAnswers', 'Clients', 'UsersAdmin', 'Reports'],
    requires: ['Helpdesk.store.Tickets', 'Helpdesk.store.TicketAnswers', 'Helpdesk.store.Clients', 'Helpdesk.store.UsersAdmin', 'Helpdesk.store.Reports'],
    init: function() {
        this.control({
            'ticketsidemenu button': {
                click: this.onTicketMenuClick
            },
            '#btnNewTicket': {
                click: this.onCriarTicket
            },
            '#addTicket': {
                click: this.saveNewTicket
            },
            '#addNewClient': {
                click: this.onAddNewClient
            },
            'clientcadastre button#save': {
                click: this.onSaveNewClient
            },
            '#ticketgrid': {
                itemdblclick: this.ticketClicked
            },
            'button#editTicket': {
                click: this.editTicket
            },
            /*'button#btnSaveEditTicket':{
             click: this.saveEditTicket
             }, */
            'ticket combobox#cmbSearch': {
                change: this.changeCmbSearch,
                buffer: 1000
            },
            'ticketgrid pagingtoolbar#dockedItem': {
                beforechange: this.changeGridPage
            },
            'editticket button#btnSaveEditTicket': {
                click: this.onSaveTicketChanges
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
            ref: 'ticketPanel',
            selector: 'ticket #ticketgrid'
        },
        {
            ref: 'ticketCardContainer',
            selector: 'ticket #cardContainer'
        },
        {
            ref: 'ticketSideMenu',
            selector: 'ticket > ticketsidemenu'
        },
        {
            ref: 'ticketEditContainer',
            selector: '#ticketEditContainer'
        },
        {
            ref: 'mainHeaderSettings',
            selector: '#settings'
        }
    ],
    list: function() {
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.ticketview);
        this.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_view);
        if (typeof this.getTicketPanel() !== 'undefined') {
            this.getTicketsEmAndamento();
        }
        else {
            this.setSideMenuButtonText();
        }
        var mainHeader = this.getMainHeader();
        var btnTicket = mainHeader.down("#ticket");
        btnTicket.toggle(true);
    },
    /**
     * Salva as alterações do ticket
     * 
     */
    onSaveTicketChanges: function(button) {

        var form = button.up('form#ticketMainView');
        var record = button.up('form#ticketMainView').getRecord();

        record.data.priority = this.getRecordFromComboBox(form.down('combobox#priorityTicket').getStore(), form.down('combobox#priorityTicket').getValue());
        record.data.category = this.getRecordFromComboBox(form.down('combobox#categoryTicket').getStore(), form.down('combobox#categoryTicket').getValue());
        record.data.responsavel = this.getRecordFromComboBox(form.down('combobox#responsibleTicket').getStore(), form.down('combobox#responsibleTicket').getValue());
        record.data.stepsTicket = form.down('textarea#stepsTicket').getValue();
        record.data.endDate = form.down('datefield#estimateTime').getValue(); //Ext.Date.format(form.down('datefield#estimateTime').getValue(),'d/m/Y');
        record.data.startDate = form.down('datefield#estimateTime').getValue();

        record.dirty = true;

        var store = this.getTicketsStore();
        console.log(store);
        //store.proxy.url = 'ticket/'+record.data.id;
        store.add(record);
        if (store.getModifiedRecords().length > 0) {
            store.sync({
                callback: function() {
                    console.log('result');
                    //this.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_view);
                }
            });
        } else {
            console.log('Nothing to save.');
        }
   },
    //Retorna o record selecionado no combobox
    getRecordFromComboBox: function(store, idSelected) {
        if (store !== null && idSelected !== null) {
            for (var i = 0; i < store.getCount(); i++) {
                if (store.data.items[i].data.id === idSelected) {
                    return store.data.items[i].data;
                }
            }
            ;
            return null;
        }
    },
    /**
     * Faz a paginação do grid de tickets de acordo com a página selecionada
     */
    changeGridPage: function(toolbar, page) {

        var myscope = this;
        var limit = (page) * 10;
        var start = limit - 10;

        myscope.getTicketPanel().getStore().proxy.url = 'ticket/all-paging';
        myscope.getTicketPanel().getStore().load({
            params: {
                user: Helpdesk.Globals.user,
                start: start,
                limit: limit
            },
            callback: function() {
                myscope.backToDefaultStore(myscope);
                myscope.setSideMenuButtonText();
            }
        });
    },
    changeCmbSearch: function(field, newValue, oldValue, eOpts) {
        //The method will be executed only if the new value have at least 3 characters
        var scope = this;
        var store = field.up('container#maincontainer').down('#ticketgrid').getStore();
        var grid = field.up('container#maincontainer').down('#ticketgrid');
        var form = this.getTicketSideMenu();
        if (newValue !== null) {
            store.removeAll();
            var storeTemp = new Helpdesk.store.Tickets();
            //Sets the proxy's store according to the pressed button on the ticketSideMenu
            if (form.down('button#buttonAll').pressed === true) {
                storeTemp.proxy.url = 'ticket/all';
            } else if (form.down('button#buttonMyTickets').pressed === true) {
                storeTemp.proxy.url = 'ticket/mytickets';
            } else if (form.down('button#buttonWithouResponsible').pressed === true) {
                storeTemp.proxy.url = 'ticket/withoutresponsible';
            } else if (form.down('button#buttonOpened').pressed === true) {
                storeTemp.proxy.url = 'ticket/opened';
            } else if (form.down('button#buttonClosed').pressed === true) {
                storeTemp.proxy.url = 'ticket/closed';
            } else {
                storeTemp.proxy.url = 'ticket/all';
            }

            storeTemp.load({
                params: {
                    user: Helpdesk.Globals.user
                },
                callback: function() {
                    for (var i = 0; i < storeTemp.getCount(); i++) {
                        if (storeTemp.data.items[i].data.client.name.toLowerCase().indexOf(newValue.toLowerCase()) > -1) {
                            store.add(storeTemp.data.items[i].data);
                        } else if (storeTemp.data.items[i].data.title.toLowerCase().indexOf(newValue.toLowerCase()) > -1) {
                            store.add(storeTemp.data.items[i].data);
                        } else if (storeTemp.data.items[i].data.category.name.toLowerCase().indexOf(newValue.toLowerCase()) > -1) {
                            store.add(storeTemp.data.items[i].data);
                        } else if (storeTemp.data.items[i].data.user.name.toLowerCase().indexOf(newValue.toLowerCase()) > -1) {
                            store.add(storeTemp.data.items[i].data);
                        } else if (storeTemp.data.items[i].data.isOpen === true) {
                            if (translations.OPENED.toLowerCase().indexOf(newValue.toLowerCase()) > -1) {
                                store.add(storeTemp.data.items[i].data);
                            }
                        } else if (storeTemp.data.items[i].data.isOpen === false) {
                            if (translations.CLOSED.toLowerCase().indexOf(newValue.toLowerCase()) > -1) {
                                store.add(storeTemp.data.items[i].data);
                            }
                        }
                    }
                    if (store.getCount() === 0 && newValue === '') {
                        for (var i = 0; i < storeTemp.getCount(); i++) {
                            store.add(storeTemp.data.items[i].data);
                        }
                    }
                    //Selects the matching values on the grid
                    scope.onTextFieldChange(newValue, store, grid);
                }
            });
        } else {

            if (form.down('button#buttonAll').pressed === true) {
                store.proxy.url = 'ticket/all';
            } else if (form.down('button#buttonMyTickets').pressed === true) {
                store.proxy.url = 'ticket/mytickets';
            } else if (form.down('button#buttonWithoutResponsible').pressed === true) {
                store.proxy.url = 'ticket/withoutresponsible';
            } else if (form.down('button#buttonOpened').pressed === true) {
                store.proxy.url = 'ticket/opened';
            } else if (form.down('button#buttonClosed').pressed === true) {
                store.proxy.url = 'ticket/closed';
            } else {
                store.proxy.url = 'ticket/all';
            }
            store.load({
                params: {
                    user: Helpdesk.Globals.user,
                    start: 0,
                    limit: 10
                },
                callback: function() {
                    store.proxy.url = 'ticket';
                }
            });
        }
    },
    /**
     * Finds all strings that matches the searched value in each grid cells.     * 
     */
    onTextFieldChange: function(searchValue, store, grid) {

        var tagsRe = /<[^>]*>/gm;
        var tagsProtect = '\x0f';
        var searchRegExp = new RegExp(searchValue, 'g' + (false ? '' : 'i'));
        var count = 0;
        var indexes = [];
        var currentIndex = null;
        store.each(function(record, idx) {

            var td = Ext.fly(grid.view.getNode(idx)).down('td'),
                    cell, matches, cellHTML;

            while (td) {
                cell = td.down('.x-grid-cell-inner');
                matches = cell.dom.innerHTML.match(tagsRe);
                cellHTML = cell.dom.innerHTML.replace(tagsRe, tagsProtect);

                // populate indexes array, set currentIndex, and replace wrap matched string in a span
                cellHTML = cellHTML.replace(searchRegExp, function(m) {
                    count += 1;
                    if (Ext.Array.indexOf(indexes, idx) === -1) {
                        indexes.push(idx);
                    }
                    if (currentIndex === null) {
                        currentIndex = idx;
                    }
                    return '<span class="' + 'x-livesearch-match' + '">' + m + '</span>';
                });

                /*// restore protected tags
                 Ext.each(matches, function(match) {
                 cellHTML = cellHTML.replace(tagsProtect, match); 
                 });*/

                // update cell html                     
                cell.dom.innerHTML = cellHTML;
                td = td.next();
            }



        });

    },
    initDashView: function() {
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.ticketview);
        this.setSideMenuButtonText();
    },
    /**
     * Açoes realizadas por cada side button 
     */
    onTicketMenuClick: function(btn) {
        this.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_datagrid);
        this.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_view);
        if (typeof this.getTicketPanel() !== 'undefined') {
            if (btn.itemId === 'buttonAll') {
                this.getAllTickets();
            }
            else if (btn.itemId === 'buttonOpened') {
                this.getTicketsEmAndamento();
            }
            else if (btn.itemId === 'buttonClosed') {
                this.getTicketsFechado();
            }
            else if (btn.itemId === 'buttonMyTickets') {
                this.getMeusTickets();
            }
            else if (btn.itemId === 'buttonWithoutResponsible') {
                this.getTicketsSemResponsavel();
            }
        }
    },
    /**
     * Retorna o proxy da store de Ticket para o default
     */
    backToDefaultStore: function(scope) {
        scope.getTicketPanel().getStore().proxy.url = 'ticket';
    },
    /**
     * Busca todos os Tickets
     */
    getAllTickets: function() {
        var myscope = this;

        myscope.getTicketPanel().getStore().proxy.url = 'ticket/all-paging';
        myscope.getTicketPanel().getStore().load({
            params: {
                user: Helpdesk.Globals.user,
                start: '0',
                limit: '10'
            },
            callback: function() {
                myscope.backToDefaultStore(myscope);
                myscope.setSideMenuButtonText();
            }
        });
        Ext.Ajax.request({
            url: 'ticket/downloadfiles',
            method: 'POST',
            params: {
                idFile: 1
            }
        });

    },
    /**
     * Busca todos os tickets ABERTOS
     */
    getTicketsEmAndamento: function() {
        var myscope = this;
        myscope.getTicketPanel().getStore().proxy.url = 'ticket/paging';
        myscope.getTicketPanel().getStore().load({
            params: {
                user: Helpdesk.Globals.user,
                start: 0,
                limit: 10
            },
            callback: function() {
                myscope.backToDefaultStore(myscope);
                myscope.setSideMenuButtonText();
            }
        });
    },
    /**
     * Busca todos os tickets FECHADOS
     */
    getTicketsFechado: function() {
        var myscope = this;

        myscope.getTicketPanel().getStore().proxy.url = 'ticket/closed';
        myscope.getTicketPanel().getStore().load({
            params: {
                user: Helpdesk.Globals.user,
                start: 0,
                limit: 10
            },
            callback: function() {
                myscope.backToDefaultStore(myscope);
                myscope.setSideMenuButtonText();
            }
        });
    },
    /**
     * Busca todos os tickets em que o usuario logado é o responsavel
     */
    getMeusTickets: function() {
        var myscope = this;

        myscope.getTicketPanel().getStore().proxy.url = 'ticket/mytickets';
        myscope.getTicketPanel().getStore().load({
            params: {
                user: Helpdesk.Globals.user,
                start: 0,
                limit: 10
            },
            callback: function() {
                myscope.backToDefaultStore(myscope);
                myscope.setSideMenuButtonText();
            }
        });
    },
    /**
     * Busca todos os tickets em que não tenha responsavel 
     */
    getTicketsSemResponsavel: function() {
        var myscope = this;

        myscope.getTicketPanel().getStore().proxy.url = 'ticket/withoutresponsible';
        myscope.getTicketPanel().getStore().load({
            params: {
                user: Helpdesk.Globals.user,
                start: 0,
                limit: 10
            },
            callback: function() {
                myscope.backToDefaultStore(myscope);
                myscope.setSideMenuButtonText();
            }
        });
    },
    /**
     * Busca e preenche as informações do sidemenu (Quantidade de tickets em cada categoria),
     * e seta visibilidade dos botões de acorodo com o perfil utilizado
     */
    setSideMenuButtonText: function() {
        var myscope = this;
        Ext.Ajax.request({
            url: 'ticket/textmenu',
            method: 'GET',
            async: false,
            params: {
                user: Helpdesk.Globals.user
            },
            success: function(o) {
                var decodedString = Ext.decode(o.responseText);

                var sm = myscope.getTicketSideMenu();
                var buttonAll = sm.down('#buttonAll');
                var buttonOpened = sm.down('#buttonOpened');
                var buttonClosed = sm.down('#buttonClosed');
                var buttonMyTickets = sm.down('#buttonMyTickets');
                var buttonWithoutResponsible = sm.down('#buttonWithoutResponsible');
                buttonAll.setText(translations.ALL + ((decodedString.todos === '0') ? (" ") : (" (" + decodedString.todos + ")")));
                buttonOpened.setText(translations.IN_PROGRESS + ((decodedString.abertos === '0') ? (" ") : (" (" + decodedString.abertos + ")")));
                buttonClosed.setText(translations.CLOSED + ((decodedString.fechados === '0') ? (" ") : (" (" + decodedString.fechados + ")")));
                buttonMyTickets.setText(translations.MY_TICKETS + ((decodedString.mytickets === '0') ? (" ") : (" (" + decodedString.mytickets + ")")));
                buttonWithoutResponsible.setText(translations.WITHOUT_RESPONSIBLE + ((decodedString.withoutresponsible === '0') ? (" ") : (" (" + decodedString.withoutresponsible + ")")));
                if (Helpdesk.Globals.userGroup === "1") {//superusuario
                    buttonAll.setVisible(true);
                    buttonOpened.setVisible(true);
                    buttonClosed.setVisible(true);
                    buttonMyTickets.setVisible(true);
                    buttonWithoutResponsible.setVisible(true);
                }
                else {//outros
                    buttonAll.setVisible(true);
                    buttonOpened.setVisible(true);
                    buttonClosed.setVisible(true);
                    buttonMyTickets.setVisible(false);
                    buttonWithoutResponsible.setVisible(false);
                }

            }
        });
    },
    /*
     * Quando o botão de novo ticket for clicado, realiza a mudança de view do TicketCardContainer
     */
    onCriarTicket: function() {
        this.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_new);
    },
    /*
     * Salva um novo ticket,
     * 
     * Busca as informações do Record no form,
     * Envia para o JAVA, 
     * e quando retornar realiza o upload dos arquivos se existir
     */
    saveNewTicket: function(button, e, options) {
        var scope = this;
        var fieldset = button.up();
        var panel = fieldset.up();
        var win = panel.up();
        win.setLoading(true);
        var form = win.down('form');
        var record = form.getRecord();
        var values = form.getValues();


        record.set(values);
        record.data.startDate = new Date();
        record.data.endDate = null;
        record.data.user = Helpdesk.Globals.userLogged;
        record.data.isOpen = true;


        if (Helpdesk.Globals.userLogged.id !== 1) {
            record.data.responsavel = null;
            record.data.priority = null;
            record.data.estimateTime = null;
            record.data.client = Helpdesk.Globals.userLogged.client;
        }
        this.getTicketPanel().getStore().add(record);
        if (this.getTicketPanel().getStore().getModifiedRecords().length > 0) {
            this.getTicketPanel().getStore().sync({
                callback: function(records, operation, success) {
                    form.getForm().reset();
                    var multiupload = win.down('multiupload');
                    multiupload.ticketId = records.operations[0].records[0].data.id;
                    multiupload.submitValues();
                    scope.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_datagrid);
                    scope.setSideMenuButtonText();
                    win.setLoading(false);
                }
            });
        } else {
            Ext.Msg.alert(translations.INFORMATION, translations.NOTHING_TO_SAVE);
        }
    },
    /**
     * Função para criar um novo Client durante o cadastro de Tikcet
     */
    onAddNewClient: function() {
        var editWindow = Ext.create('Helpdesk.view.client.ClientCadastre');
        editWindow.setTitle(translations.NEW_CLIENT);
        var form = editWindow.down('form');
        form.loadRecord(Ext.create('Helpdesk.model.Client'));
        editWindow.show();
    },
    /*
     * Função para salvar o novo Client criado
     */
    onSaveNewClient: function(button) {
        var win = button.up('window');
        var form = win.down('form');
        var record = form.getRecord();
        var values = form.getValues();
        record.set(values);
        this.getClientsStore().add(record);
        if (this.getClientsStore().getModifiedRecords().length > 0) {
            this.getClientsStore().sync({
                callback: function(result) {
                    form.loadRecord(result.operations[0].records[0]);
                }
            });
        } else {
            Ext.Msg.alert(translations.INFORMATION, translations.NOTHING_TO_SAVE);
        }
    },
    /**
     * @author Ricardo
     * 
     * Altera para a view de resposta de ticket
     *     
     */
    ticketClicked: function(grid, record, item, index, e, eOpts) {
        var ticketView = this.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details);
        ticketView.down('form#ticketMainView').loadRecord(Ext.create('Helpdesk.model.Ticket'));
        this.setValuesFromView(ticketView, record);
    },
    /**
     * @author Ricardo
     * 
     * Insere os valores na view de cadastro de ticket
     */
    setValuesFromView: function(ticketView, record) {

        if (ticketView !== null && record !== null) {

            ticketView.down('form#ticketMainView').loadRecord(record);

            ticketView.down('text#tktTitle').setText(translations.TICKET + ' #' + record.data.id + ' - ' + record.data.title);
            if (record.data.isOpen)
                ticketView.down('text#tktStatus').setText(translations.TICKET_TITLE_OPENED);
            else
                ticketView.down('text#tktStatus').setText(translations.TICKET_TITLE_CLOSED);

            ticketView.down('text#tktBy').setText(record.data.userName);
            ticketView.down('text#tktAt').setText(record.data.startDate);
            ticketView.down('text#tktCategory').setText(record.data.categoryName);
            ticketView.down('text#tktEstimatedTime').setText(record.data.estimateTime);
            ticketView.down('text#tktPriority').setText(record.data.priorityName);
            ticketView.down('text#tktResponsible').setText(record.data.responsavelName);
            ticketView.down('text#tktSteps').setText(record.data.stepsTicket);

            //Insere a descrição do ticket            
            ticketView.down('panel#tktAnswers').removeAll(true);

            //Recebe todas as respostas do ticket
            var answerStore = this.getTicketAnswersStore();
            answerStore.proxy.url = 'ticket-answer/find-by-ticket/' + record.data.id;
            answerStore.load({
                callback: function() {
                    var resposta = Ext.create('Helpdesk.view.ticket.TicketAnswerPanel', {
                        title: record.data.userName,
                        html: record.data.description
                    });
                    ticketView.down('panel#tktAnswers').items.add(resposta);

                    for (i = 0; i < answerStore.getCount(); i++) {
                        resposta = Ext.create('Helpdesk.view.ticket.TicketAnswerPanel', {
                            title: answerStore.data.items[i].data.user.name,
                            html: answerStore.data.items[i].data.description
                        });
                        ticketView.down('panel#tktAnswers').items.add(resposta);
                    }
                    ticketView.down('panel#tktAnswers').doLayout();
                }
            });
        }
    },
    /*
     * Muda CardContainer para a view de Edição do ticket.
     * Seta os valores do ticket na tela de edição
     */
    editTicket: function(button, e, options) {
        var ticketView = this.getTicketEditContainer();
        this.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_edit);

        //set category combobox
        var categoryText = ticketView.down('#tktCategory').text;
        var categoryCombo = ticketView.down('#categoryTicket');
        var categoryStore = categoryCombo.store;
        var categoryIndex = Ext.StoreMgr.lookup(categoryStore).findExact('name', categoryText);
        var categoryRecord = Ext.StoreMgr.lookup(categoryStore).getAt(categoryIndex);
        categoryCombo.setValue(categoryRecord);

        //set responsavel combobox
        var responsavelText = ticketView.down('#tktResponsible').text;
        var responsavelCombo = ticketView.down('#responsibleTicket');
        var responsavelStore = responsavelCombo.store;
        if (responsavelText === '' && Helpdesk.Globals.userGroup === '1') {
            responsavelText = Helpdesk.Globals.userLogged.name;
        }
        var responsavelIndex = Ext.StoreMgr.lookup(responsavelStore).findExact('name', responsavelText);
        var responsavelRecord = Ext.StoreMgr.lookup(responsavelStore).getAt(responsavelIndex);
        responsavelCombo.setValue(responsavelRecord);



        //set priority combobox
        var priorityText = ticketView.down('#tktPriority').text;
        var priorityCombo = ticketView.down('#priorityTicket');
        var priorityStore = priorityCombo.store;
        var priorityIndex = Ext.StoreMgr.lookup(priorityStore).findExact('name', priorityText);
        var priorityRecord = Ext.StoreMgr.lookup(priorityStore).getAt(priorityIndex);
        priorityCombo.setValue(priorityRecord);

        //set prazo datefield       
        var estimatedText = ticketView.down('#tktEstimatedTime').text;
        if (estimatedText !== '') {
            var estimatedDate = new Date(estimatedText);
            var estimatedDateField = ticketView.down('#estimateTime');
            estimatedDateField.setValue(estimatedDate);
        }

        //set steps textarea
        var stepsText = ticketView.down('#tktSteps').text;
        ticketView.down('#stepsTicket').setValue(stepsText);

    },
    /*
     * Salva as alterações realizadas no ticket,
     * Retorna para a View de Details do ticket
     */
    saveEditTicket: function(button, e, options) {
        this.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_view);
    }
});