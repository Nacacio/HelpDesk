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
    stores: ['Tickets', 'TicketAnswers', 'Clients', 'UsersAdmin', 'Reports', 'ChangesTicket'],
    requires: ['Helpdesk.model.Ticket', 'Helpdesk.store.Tickets', 'Helpdesk.store.TicketAnswers', 'Helpdesk.store.Clients', 'Helpdesk.store.UsersAdmin', 'Helpdesk.store.Reports', 'Helpdesk.store.ChangesTicket'],
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
                itemclick: this.ticketClicked
            },
            'button#editTicket': {
                click: this.editTicket
            },
            'ticket combobox#cmbSearch': {
                change: this.changeCmbSearch,
                buffer: 1000
            },
            'ticketgrid pagingtoolbar#dockedItem': {
                beforechange: this.changeGridPage
            },
            'editticket button#btnSaveEditTicket': {
                click: this.onSaveTicketChanges
            },
            'editticket button#btnCancelEditTicket': {
                click: this.cancelEditTicket
            },
            'ticketdetails button': {
                click: this.setStatusTicket
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
            ref: 'ticketDetailsView',
            selector: 'ticketdetails'
        },
        {
            ref: 'ticketView',
            selector: 'ticket'
        }

    ],
    list: function() {
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.ticketview);
        this.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_view);
        if (typeof this.getTicketPanel() !== 'undefined') {
            if (Helpdesk.Globals.userLogged.userGroup.id == Helpdesk.Globals.idAdminGroup) {
                //Verifica se algum botão já estava marcado e busca os tickets de acordo com a seleção correspondente
                if(this.getTicketSideMenu().down('#buttonAll').pressed){
                    this.getAllTickets();
                    this.getTicketSideMenu().down('#buttonAll').toggle(true);
                }               
                else if(this.getTicketSideMenu().down('#buttonMyTickets').pressed){
                    this.getMyTickets();
                    this.getTicketSideMenu().down('#buttonMyTickets').toggle(true);
                }                
                else if(this.getTicketSideMenu().down('#buttonWithoutResponsible').pressed){
                    this.getTicketsWithoutResponsible();
                    this.getTicketSideMenu().down('#buttonWithoutResponsible').toggle(true);
                }                
                else if(this.getTicketSideMenu().down('#buttonOpened').pressed){
                    this.getTicketsOpened();
                    this.getTicketSideMenu().down('#buttonOpened').toggle(true);
                }                
                else if(this.getTicketSideMenu().down('#buttonClosed').pressed){
                    this.getTicketsClosed();
                    this.getTicketSideMenu().down('#buttonClosed').toggle(true);
                }               
                else{
                    this.getMyTickets();
                    this.getTicketSideMenu().down('#buttonMyTickets').toggle(true);
                }            
            } else {
                this.getTicketsOpened();
                this.getTicketSideMenu().down('#buttonOpened').toggle(true);
            }
        }
        else {
            this.setSideMenuButtonText();
        }
        var mainHeader = this.getMainHeader();
        var btnTicket = mainHeader.down("#ticket");
        btnTicket.toggle(true);
    },
    /**
     * Fecha o ticket 
     * @param {type} button
     * @returns {undefined}
     */
    closeTicket: function(button) {
        var scope = this;
        var record = button.up('form#ticketMainView').getRecord();
        record.dirty = true;
        var store = this.getTicketsStore();
        store.proxy.url = 'ticket/close-ticket';
        store.add(record);
        store.sync({
            callback: function() {
                store.proxy.url = 'ticket';
                scope.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_datagrid);
                scope.setSideMenuButtonText();
            }
        });
    },
    //Fecha ou abre o ticket
    setStatusTicket: function(button) {
        if (button.id === 'btnCloseTkt' || button.id === 'btnOpenTkt') {
            var scope = this;
            var mainView = this.getTicketView();
            
            
            var record = button.up('form#ticketMainView').getRecord();
            record.dirty = true;
            var store = this.getTicketsStore();
            if (button.id === 'btnCloseTkt') {
                mainView.setLoading(translations.CLOSING_TICKET);
                store.proxy.url = 'ticket/close-ticket';
            } else if (button.id === 'btnOpenTkt') {
                mainView.setLoading(translations.REOPENING_TICKET);
                store.proxy.url = 'ticket/open-ticket';
            }
            store.add(record);
            store.sync({
                callback: function() {
                    mainView.setLoading(false);
                    store.proxy.url = 'ticket';
                    scope.setSideMenuButtonText();

                    /**
                     * @author andresulivam
                     * @type Boolean|Boolean
                     */
                    var ticketOpen;
                    if (button.id === 'btnCloseTkt') {
                        ticketOpen = false;
                    } else if (button.id === 'btnOpenTkt') {
                        ticketOpen = true;
                    }
                    scope.formatTicketDetailsByStatusTicket(ticketOpen, button.up('form#ticketMainView'));
                }
            });
        }
    },
    /**
     * @author andresulivam
     * 
     * Formata a tela de ticketdetails após abrir ou fechar o ticket.
     * Habilita ou desabilita a tela de inserção de nova resposta e configura labels e botões do ticketdetails.
     * 
     * @param {type} ticketOpen
     * @param {type} ticketView
     * @returns {undefined}
     */
    formatTicketDetailsByStatusTicket: function(ticketOpen, ticketView) {
        if (ticketOpen === true) {
            ticketView.down('text#tktStatus').setText(translations.TICKET_TITLE_OPENED);
            ticketView.down('label#lblTicketOpen').setVisible(true);
            ticketView.down('button#btnCloseTkt').setVisible(true);
            ticketView.down('label#lblTicketClosed').setVisible(false);
            ticketView.down('button#btnOpenTkt').setVisible(false);               
            //Seta visibilidade do botão salvar
            if(Helpdesk.Globals.idAdminGroup == Helpdesk.Globals.userLogged.userGroup.id){
                ticketView.down('button#editTicket').setVisible(true);        
            }
            ticketView.down('button#btnSaveAnswTkt').setVisible(true);
            //Seta visibildade do panel de nova resposta
            ticketView.down('panel#panelElementsNewAnswer').show();
        } else {
            ticketView.down('text#tktStatus').setText(translations.TICKET_TITLE_CLOSED);
            ticketView.down('label#lblTicketOpen').setVisible(false);
            ticketView.down('button#btnCloseTkt').setVisible(false);
            ticketView.down('label#lblTicketClosed').setVisible(true);
            ticketView.down('button#btnOpenTkt').setVisible(true);
            if(Helpdesk.Globals.idAdminGroup == Helpdesk.Globals.userLogged.userGroup.id){
                ticketView.down('button#editTicket').setVisible(false);        
            }
            //Seta visibilidade do botão salvar
            ticketView.down('button#btnSaveAnswTkt').setVisible(false);
            //Seta visibildade do panel de nova resposta
            ticketView.down('panel#panelElementsNewAnswer').hide();
        }
    },
    /**
     * Salva as alterações do ticket
     * @param {type} button
     * @returns {undefined}
     */
    onSaveTicketChanges: function(button) {
        var myScope = this;
        var mainView = this.getTicketView();
        var form = button.up('form#ticketMainView');
        var record = button.up('form#ticketMainView').getRecord();
        mainView.setLoading('Salvando...');
        if (form.down('combobox#priorityTicket').getValue() === null || form.down('combobox#priorityTicket').getValue() === '') {
            var priorityIndex = Ext.StoreMgr.lookup(form.down('combobox#priorityTicket').getStore()).findExact('name', translations.NO_PRIORITY);
            var priorityRecord = Ext.StoreMgr.lookup(form.down('combobox#priorityTicket').getStore()).getAt(priorityIndex);
            form.down('combobox#priorityTicket').setValue(priorityRecord);
            record.data.priority = this.getRecordFromComboBox(form.down('combobox#priorityTicket').getStore(), form.down('combobox#priorityTicket').getValue());
        } else {
            record.data.priority = this.getRecordFromComboBox(form.down('combobox#priorityTicket').getStore(), form.down('combobox#priorityTicket').getValue());
        }

        record.data.category = this.getRecordFromComboBox(form.down('combobox#categoryTicket').getStore(), form.down('combobox#categoryTicket').getValue());
        //Se nenhuma categoria tiver sido marcada, o ticket recebe "Sem categoria"
        if (typeof record.data.category === 'undefined') {
            record.data.category = form.down('combobox#categoryTicket').getStore().data.items[4].data;
        }
        record.data.responsible = this.getRecordFromComboBox(form.down('combobox#responsibleTicket').getStore(), form.down('combobox#responsibleTicket').getValue());
        record.data.stepsTicket = form.down('textarea#stepsTicket').getValue();

        var estimateTime = form.down('datefield#estimateTime').getValue();
        //Adiciona um dia a variável pois o mesmo é perdido ao passar para o java
        if(estimateTime!==null){
            estimateTime.setDate(estimateTime.getDate()+1);
        }
        record.data.estimateTime = estimateTime;
        record.dirty = true;
        var store = this.getTicketsStore();
        /**
         * @author andresulivam
         */
        if (typeof record.data.priority === 'undefined') {
            record.data.priority = null;
        }
        if (typeof record.data.responsible === 'undefined') {
            record.data.responsible = null;
        }
        //---------------------------------------------------------------------
        store.add(record);
        if (store.getModifiedRecords().length > 0) {
            store.sync({
                callback: function() {
                    myScope.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_view);
                    myScope.setValuesFromView(form.up(), record);
                    mainView.setLoading(false);
                }
            });
        } else {
            mainView.setLoading(false);
            Ext.Msg.alert(translations.INFORMATION, translations.NOTHING_TO_SAVE);
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
     * @param {type} toolbar
     * @param {type} page
     * @returns {undefined}
     */
    changeGridPage: function(toolbar, page) {
        var myscope = this;
        var limit = (page) * Helpdesk.Globals.pageSizeGrid;
        var start = limit - Helpdesk.Globals.pageSizeGrid;

        myscope.getTicketPanel().getStore().proxy.url = this.getProxy() + '-paging';
        myscope.getTicketPanel().getStore().load({
            params: {
                user: Helpdesk.Globals.userLogged.userName,
                start: start,
                limit: limit
            },
            callback: function() {
                myscope.backToDefaultStore(myscope);
                myscope.setSideMenuButtonText();
            }
        });
    },
    getProxy: function() {

        var form = this.getTicketSideMenu();

        if (form.down('button#buttonAll').pressed === true) {
            return 'ticket/all';
        } else if (form.down('button#buttonMyTickets').pressed === true) {
            return 'ticket/mytickets';
        } else if (form.down('button#buttonWithoutResponsible').pressed === true) {
            return 'ticket/withoutresponsible';
        } else if (form.down('button#buttonOpened').pressed === true) {
            return 'ticket/opened';
        } else if (form.down('button#buttonClosed').pressed === true) {
            return 'ticket/closed';
        } else {
            return 'ticket/all';
        }
    },
    changeCmbSearch: function(field, newValue, oldValue, eOpts) {
        //The method will be executed only if the new value have at least 3 characters
        var scope = this;
        var store = field.up('container#maincontainer').down('#ticketgrid').getStore();
        var grid = field.up('container#maincontainer').down('#ticketgrid');
        var form = this.getTicketSideMenu();
        if (newValue !== null) {
            field.up('container#maincontainer').down('#ticketgrid').setLoading(translations.LOADING);
            store.removeAll();
            var storeTemp = new Helpdesk.store.Tickets();
            storeTemp.proxy.url = this.getProxy();
            storeTemp.load({
                params: {
                    user: Helpdesk.Globals.userLogged.userName
                },
                callback: function() {
                    field.up('container#maincontainer').down('#ticketgrid').setLoading(false);
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
            store.proxy.url = this.getProxy();
            store.load({
                params: {
                    user: Helpdesk.Globals.userLogged.userName,
                    start: 0,
                    limit: Helpdesk.Globals.pageSizeGrid
                },
                callback: function() {
                    store.proxy.url = 'ticket';
                }
            });
        }
    },
    /**
     * Finds all strings that matches the searched value in each grid cells.
     * @param {type} searchValue
     * @param {type} store
     * @param {type} grid
     * @returns {undefined}
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
                cell.dom.innerHTML = cellHTML;
                td = td.next();
            }
        });
    },
    //Atualiza o grid após ação de crud
    atualizaGrid: function() {
        var button;
        var sideMenu = this.getTicketSideMenu();

        if (sideMenu.down('button#buttonAll').pressed === true) {
            button = sideMenu.down('button#buttonAll');
        } else if (sideMenu.down('button#buttonOpened').pressed === true) {
            button = sideMenu.down('button#buttonOpened');
        } else if (sideMenu.down('button#buttonClosed').pressed === true) {
            button = sideMenu.down('button#buttonClosed');
        } else if (sideMenu.down('button#buttonMyTickets').pressed === true) {
            button = sideMenu.down('button#buttonMyTickets');
        } else if (sideMenu.down('button#buttonWithoutResponsible').pressed === true) {
            button = sideMenu.down('button#buttonWithoutResponsible');
        }
        if (button !== null) {
            this.onTicketMenuClick(button);
        }

    },
    initDashView: function() {
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.ticketview);
        this.setSideMenuButtonText();
    },
    /**
     * Açoes realizadas por cada side button 
     * @param {type} btn
     * @returns {undefined}
     */
    onTicketMenuClick: function(btn) {
        this.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_datagrid);
        this.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_view);
        if (typeof this.getTicketPanel() !== 'undefined') {
            if (btn.itemId === 'buttonAll') {
                this.getAllTickets();
            }
            else if (btn.itemId === 'buttonOpened') {
                this.getTicketsOpened();
            }
            else if (btn.itemId === 'buttonClosed') {
                this.getTicketsClosed();
            }
            else if (btn.itemId === 'buttonMyTickets') {
                this.getMyTickets();
            }
            else if (btn.itemId === 'buttonWithoutResponsible') {
                this.getTicketsWithoutResponsible();
            }
        }
    },
    /**
     * Retorna o proxy da store de Ticket para o default
     * @param {type} scope
     * @returns {undefined}
     */
    backToDefaultStore: function(scope) {
        scope.getTicketPanel().getStore().proxy.url = 'ticket';
    },
    /**
     * Busca todos os Tickets
     */
    getAllTickets: function() {
        this.loadStoreBasic('all');
    },
    /**
     * Busca todos os tickets ABERTOS
     */
    getTicketsOpened: function() {
        this.loadStoreBasic('opened');
    },
    /**
     * Busca todos os tickets FECHADOS
     */
    getTicketsClosed: function() {
        this.loadStoreBasic('closed');
    },
    /**
     * Busca todos os tickets em que o usuario logado é o responsavel
     */
    getMyTickets: function() {
        this.loadStoreBasic('mytickets');
    },
    /**
     * Busca todos os tickets em que não tenha responsavel 
     */
    getTicketsWithoutResponsible: function() {
        this.loadStoreBasic('withoutresponsible');
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
                user: Helpdesk.Globals.userLogged.userName
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
                if (Helpdesk.Globals.userLogged.userGroup.id == Helpdesk.Globals.idAdminGroup) {//superusuario
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
    saveNewTicket: function(button, e, options) {
        var ticketView = this.getTicketView();
        //upload arquivos, caso seja success, salva o novo ticket
        var multiupload = ticketView.down('multiupload');
        this.submitValues(multiupload);
    },
    /**
     * Editado por @andresulivam
     * @returns {undefined}
     */
    saveTicket: function() {
        var scope = this;
        var ticketView = scope.getTicketView();

        var form = ticketView.down('form');
        var record = form.getRecord();
        var values = form.getValues();

        record.set(values);
        //startDate será atribuido no JAVA
        record.data.startDate = null;
        record.data.endDate = null;
        record.data.user = Helpdesk.Globals.userLogged;
        record.data.isOpen = true;

        if (Helpdesk.Globals.userLogged.userGroup.id != Helpdesk.Globals.idAdminGroup) {
            record.data.responsible = null;
            record.data.priority = null;
            record.data.estimateTime = null;
            record.data.client = Helpdesk.Globals.userLogged.client;
        } else {
            console.log(record.data.estimateTime);
            // categoria
            if (form.down('combobox#categoryTicket').getValue() === null) {
                record.data.category = null;
            }
            // responsável
            if (form.down('combobox#responsibleTicket').getValue() === null) {
                record.data.responsible = null;
            }
            //prioridade
            if (form.down('combobox#priorityCmb').getValue() === null) {
                record.data.priority = null;
            } else {
                var priorityTemp = form.down('combobox#priorityCmb');
                if (priorityTemp.valueModels !== null) {
                    var isModel = priorityTemp.valueModels[0] instanceof Helpdesk.model.Priority;
                    if (!isModel) {
                        record.data.priority = null;
                    }
                } else {
                    record.data.priority = null;
                }
            }
            //prazo estimado
            if (form.down('datefield#estimateTime').getValue() === null) {
                record.data.estimateTime = null;
            }else{
                //Adiciona um dia a mais na variável pois o mesmo é perdido na conversão para o java               
                var dateFormattedTemp = new Date(form.down('datefield#estimateTime').getValue());
                dateFormattedTemp.setDate(dateFormattedTemp.getDate()+1);
                record.data.estimateTime = dateFormattedTemp;
            }
        }

        //verificando se todos os campos obrigatórios estão preenchidos.
        var check = false;
        //verificando se a categoria selecionada é válida.
        if (form.down('combobox#categoryTicket').getValue() !== null) {
            var categoryTemp = form.down('combobox#categoryTicket');
            if (categoryTemp.valueModels !== null) {
                var isModel = categoryTemp.valueModels[0] instanceof Helpdesk.model.Category;
                if (isModel) {
                    check = true;
                }
            }
        }
        if (check) {
            check = false;
            //verificando se os campos de passos, assunto e descrição são válidos.
            if (form.down('textarea#stepsTicket').value !== '' &&
                    form.down('textfield#subject').value !== '' &&
                    form.down('textarea#description').value !== '') {
                check = true;
            }
            if (check) {
                //testando se o usuário é usuário admin para validar o cliente selecionado.
                if (record.data.user.userGroup.id == Helpdesk.Globals.idAdminGroup) {
                    check = false;
                    //verificando se o cliente selecionado é válido.
                    if (form.down('combobox#clientName').getValue() !== null) {
                        var clientTemp = form.down('combobox#clientName');
                        if (clientTemp.valueModels !== null) {
                            var isModel = clientTemp.valueModels[0] instanceof Helpdesk.model.Client;
                            if (isModel) {
                                check = true;
                            }
                        }
                    }
                }
            }
        }
        if (check) {
            this.getTicketPanel().getStore().add(record);
            if (this.getTicketPanel().getStore().getModifiedRecords().length > 0) {
                this.getTicketPanel().getStore().sync({
                    callback: function(records, operation, success) {
                        form.getForm().reset();
                        scope.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_datagrid);
                        scope.setSideMenuButtonText();
                        if (Helpdesk.Globals.userLogged.userGroup.id == Helpdesk.Globals.idAdminGroup) {
                            scope.getMyTickets();
                            scope.getTicketSideMenu().down('#buttonMyTickets').toggle(true);
                        } else {
                            scope.getTicketsOpened();
                            scope.getTicketSideMenu().down('#buttonOpened').toggle(true);
                        }
                        ticketView.setLoading(false);
                    }
                });
            } else {
                Ext.Msg.alert(translations.INFORMATION, translations.NOTHING_TO_SAVE);
                ticketView.setLoading(false);
            }
        } else {
            ticketView.setLoading(false);
            Ext.Msg.alert(translations.INFORMATION, translations.REQUIRED_ITENS_TICKETS);
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
     * @param {type} grid
     * @param {type} record
     * @param {type} item
     * @param {type} index
     * @param {type} e
     * @param {type} eOpts
     * @returns {undefined}
     */
    ticketClicked: function(grid, record, item, index, e, eOpts) {
        var ticketView = this.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details);
       // ticketView.setLoading(translations.LOADING);
        ticketView.down('form#ticketMainView').loadRecord(Ext.create('Helpdesk.model.Ticket'));
        this.setValuesFromView(ticketView, record);
    },
    /**
     * @author Ricardo
     * 
     * Insere os valores na view de cadastro de ticket
     * @param {type} ticketView
     * @param {type} record
     * @returns {undefined}
     */
    setValuesFromView: function(ticketView, record) {
        var scope = this;
        if (ticketView !== null && record !== null) {

            var ticket = record.data;

            ticketView.down('form#ticketMainView').loadRecord(record);

            //text titulo
            ticketView.down('text#tktTitle').setText(translations.TICKET + ' #' + ticket.id + ' - ' + ticket.title);

            //text status
            if (ticket.isOpen) {
                ticketView.down('text#tktStatus').setText(translations.TICKET_TITLE_OPENED);
            } else {
                ticketView.down('text#tktStatus').setText(translations.TICKET_TITLE_CLOSED);
            }

            //text by
            ticketView.down('text#tktBy').setText(ticket.userName);

            //formata data Inicial do ticket
            var dateInicial = new Date(ticket.startDate);            
            dateInicial = Ext.Date.format(dateInicial, translations.FORMAT_DATE_TIME);
            ticketView.down('text#tktAt').setText(dateInicial);

            //text categoria
            ticketView.down('text#tktCategory').setText(ticket.categoryName);

            //text prioridade
            ticketView.down('text#tktPriority').setText(ticket.priorityName);

            //text prazo estimado
            if (ticket.estimateTime !== null) {                
                var dateTemp;
                if (ticket.estimateTime.toString().indexOf('-') >= 0) {
                    var splitedDate = ticket.estimateTime.split('-');                
                    dateTemp = new Date(splitedDate[0],splitedDate[1]-1,splitedDate[2]);    
                }else{
                    dateTemp = new Date(ticket.estimateTime);
                }                                
                dateTemp = Ext.Date.format(dateTemp, translations.FORMAT_JUST_DATE);
                ticketView.down('text#tktEstimatedTime').setText(dateTemp);
            } else {
                ticketView.down('text#tktEstimatedTime').setText(translations.NO_DEADLINE_DEFINED);
            }

            //text responsável
            if (ticket.responsibleName !== null && ticket.responsibleName !== '') {
                ticketView.down('text#tktResponsible').setText(ticket.responsibleName);
            } else {
                ticketView.down('text#tktResponsible').setText(translations.NO_RESPONSIBLE);
            }

            //text passos para reproduzir o erro
            ticketView.down('text#tktSteps').setText(ticket.stepsTicket);

            //Remove todas as respostas do panel            
            ticketView.down('panel#tktAnswers').removeAll(true);

            //Recebe todas as respostas do ticket
            var answerStore = this.getTicketAnswersStore();
            answerStore.proxy.url = 'ticket-answer/find-by-ticket/' + ticket.id;
            answerStore.load({
                callback: function() {
                    var answersTotal = new Array();
                    var resposta = Ext.create('Helpdesk.view.ticket.TicketAnswerPanel', {
                        title: '<div class="div-title-answer"><p align="left">' + ticket.userName + '</p><p class="date-title-answer">' + dateInicial + '</p></div>'
                    });
                    resposta.down('label#corpo').text = ticket.description;
                    resposta.down('hiddenfield#id').text = ticket.id;
                    resposta.down('hiddenfield#idAnswer').text = 0;

                    //adicionando o primeiro panel a lista de panels de respostas.
                    answersTotal[0] = resposta;
                    for (i = 0; i < answerStore.getCount(); i++) {
                        var answerTemp = answerStore.data.items[i].data;
                        var name = answerTemp.user.name;
                        dateTemp = new Date(answerTemp.dateCreation);
                        var date = Ext.Date.format(dateTemp, translations.FORMAT_DATE_TIME);

                        resposta = Ext.create('Helpdesk.view.ticket.TicketAnswerPanel', {
                            title: '<div class="div-title-answer"><p align="left">' + name + '</p><p class="date-title-answer">' + date + '</p></div>'
                        });
                        resposta.down('label#corpo').text = answerTemp.description;
                        resposta.down('hiddenfield#id').text = ticket.id;
                        resposta.down('hiddenfield#idAnswer').text = answerTemp.id;

                        //adicionado o panel de resposta na última posição da lista.
                        answersTotal[answersTotal.length] = resposta;
                    }
                    scope.resetMultiupload(ticketView);
                    scope.formatAnswerWithFilesAndChanges(ticketView, ticket, answersTotal);
                }
            });
        }
        //Seta a visibilidade dos botões de fechar ou abrir tickets de acordo com o ticket corrente
        if (ticket.isOpen === true) {
            ticketView.down('label#lblTicketOpen').setVisible(true);
            ticketView.down('button#btnCloseTkt').setVisible(true);
            ticketView.down('label#lblTicketClosed').setVisible(false);
            ticketView.down('button#btnOpenTkt').setVisible(false);
            //Seta visibilidade do botão salvar
            ticketView.down('button#btnSaveAnswTkt').setVisible(true);
            //Seta a visibilidade do botão de edição do ticket
            if (Helpdesk.Globals.userLogged.userGroup.id === 1) {
                ticketView.down('button#editTicket').show();
            }
            ticketView.down('panel#panelElementsNewAnswer').show();
            // ticketView.down('text#txtNewAnswer').show();
        }
        else {
            ticketView.down('label#lblTicketOpen').setVisible(false);
            ticketView.down('button#btnCloseTkt').setVisible(false);
            ticketView.down('label#lblTicketClosed').setVisible(true);
            ticketView.down('button#btnOpenTkt').setVisible(true);
            //Seta visibilidade do botão salvar
            ticketView.down('button#btnSaveAnswTkt').setVisible(false);
            //Seta a visibilidade do botão de edição do ticket
            ticketView.down('button#editTicket').hide();
            ticketView.down('panel#panelElementsNewAnswer').hide();
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
        var responsibleText = ticketView.down('#tktResponsible').text;
        var responsibleCombo = ticketView.down('#responsibleTicket');
        var responsibleStore = responsibleCombo.store;
        var resposibleTemp;
        if (responsibleText === '' || responsibleText === translations.NO_RESPONSIBLE) {
            resposibleTemp = new Helpdesk.model.User();
            resposibleTemp.data.name = translations.NO_RESPONSIBLE;
            responsibleCombo.setValue(resposibleTemp);
        } else {
            var responsibleIndex = Ext.StoreMgr.lookup(responsibleStore).findExact('name', responsibleText);
            var responsibleRecord = Ext.StoreMgr.lookup(responsibleStore).getAt(responsibleIndex);
            responsibleCombo.setValue(responsibleRecord);
        }

        //set priority combobox
        var priorityText = ticketView.down('#tktPriority').text;
        var priorityCombo = ticketView.down('#priorityTicket');
        var priorityStore = priorityCombo.store;
        var priorityIndex = Ext.StoreMgr.lookup(priorityStore).findExact('name', priorityText);
        var priorityRecord = Ext.StoreMgr.lookup(priorityStore).getAt(priorityIndex);
        priorityCombo.setValue(priorityRecord);

        //set prazo datefield       
        var estimatedText = ticketView.down('#tktEstimatedTime').text;
        var estimatedDateField = ticketView.down('#estimateTime');
        if (estimatedText !== '' && estimatedText !== translations.NO_DEADLINE_DEFINED) {
            //var estimatedDate = new Date(estimatedText);            
            //estimatedDateField.setValue(estimatedDate);
            estimatedDateField.setValue(estimatedText);
        } else {
            estimatedDateField.setValue(null);
        }

        //set steps textarea
        var stepsText = ticketView.down('#tktSteps').text;
        ticketView.down('#stepsTicket').setValue(stepsText);

    },
    cancelEditTicket: function(button, e, options) {
        var ticketView = this.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_view);
    },
    /**
     * @author andresulivam
     * 
     * Resetando o campo de multiupload para retirar os arquivos que foram inseridos anteriormente.
     * 
     * @param {type} ticketView
     * @returns {undefined}
     */
    resetMultiupload: function(ticketView) {
        // removendo e adicionando um novo item 'multiupload' para zerar os anexos inseridos anteriormente
        var multiUpload = Ext.create('Helpdesk.util.MultiUpload', {
            padding: '0 0 10 0'
        });
        var panel = ticketView.down('panel #panelElementsNewAnswer');
        var i = 0;
        var index;
        panel.items.each(function(item) {
            // encontrando o item 'multiupload' e setando o index para a posição certa de inseri-lo novamente
            if (item.xtype === 'multiupload') {
                index = i;
                panel.remove(item);
            }
            i++;
        });
        ticketView.down('panel #panelElementsNewAnswer').insert(index, multiUpload);
        ticketView.down('panel #panelElementsNewAnswer').doLayout();
    },
    /**
     * Método para inserir no painel de resposta os anexos e mudanças de tickets ocorridas. 
     * 
     * @param {type} ticketView
     * @param {type} record
     * @param {type} answersTotal
     * @returns {undefined}
     */
    formatAnswerWithFilesAndChanges: function(ticketView, record, answersList) {
        if (ticketView !== null && record !== null) {
            var ticket = Ext.ModelManager.create(record, 'Helpdesk.model.Ticket');

            // inserindo os anexos nas respostas.
            answersList = this.getFilesFromTicket(ticket, answersList);

            // inserindo as mudanças de ticket nas respostas.
            answersList = this.getChangesFromTicket(ticket, answersList);

            if (answersList !== null && answersList.length > 0) {
                for (var i = 0; i < answersList.length; i++) {
                    ticketView.down('panel#tktAnswers').items.add(answersList[i]);
                }
                ticketView.down('panel#tktAnswers').doLayout();
                //expando panel da última resposta inserida.
                var answers = ticketView.down('panel#tktAnswers').items;
                var itemsLength = answers.length;
                if (itemsLength > 0) {
                    answers.items[itemsLength - 1].expand(true);
                    answers.items[itemsLength - 1].el.setStyle('margin', '0 0 10px 0');
                }
                ticketView.down('panel#tktAnswers').doLayout();
            }
            
        }
    },
    /**
     * Método que insere os anexos do ticket e das respostas nos painéis.
     * O parâmetro 'answersList' são os paineis de respostas já prontos com os ids e faltando os arquivos.
     * Ao final retorna todos os paineis com os arquivos anexados a eles.
     * 
     * @param {type} ticket
     * @param {type} answersList
     * @returns answersList
     */
    getFilesFromTicket: function(ticket, answersList) {
        var scope = this;
        var ticketId = ticket.data.id;

        Ext.Ajax.request({
            url: 'attachments/' + ticketId + '/attachments',
            method: 'GET',
            success: function(response, opts) {
                if (response.responseText !== '') {
                    var responseJSON = Ext.decode(response.responseText);
                    for (var i = 0; i < answersList.length; i++) {
                        var answer = answersList[i];
                        var idAnswer = answer.down('hiddenfield#idAnswer').text;
                        var idTicket = answer.down('hiddenfield#id').text;
                        var fileContainer = answer.down('container#anexo');
                        for (var j = 0; j < responseJSON.length; j++) {
                            var file = responseJSON[j];
                            var fileIdTicket = file.fileTicketId;
                            var fileIdAnswer = file.fileTicketAnswerId;
                            var fileName = file.fileName;
                            var fileId = file.fileId;
                            var insertAnexo = false;
                            if (idAnswer === 0) {
                                if (fileIdAnswer === '' && parseInt(fileIdTicket) === parseInt(idTicket)) {
                                    insertAnexo = true;
                                }
                            }
                            else {
                                if (parseInt(fileIdAnswer) === parseInt(idAnswer)) {
                                    insertAnexo = true;
                                }
                            }
                            if (insertAnexo) {
                                var containerAnexos = answer.down('container#containerAttachments');
                                containerAnexos.setVisible(true);
                                var linkButton = {
                                    xtype: 'button',
                                    text: fileName,
                                    fileId: fileId,
                                    cls: 'btn-linkbutton-custom',
                                    iconCls: 'clip',
                                    listeners: {
                                        click: function(button, e, eOpts) {
                                            scope.downloadFile(button.fileId);
                                        }
                                    }
                                };
                                fileContainer.insert(linkButton);
                            }
                        }
                    }
                }
            }
        });
        return answersList;
    },
    /**
     * Método que insere as mudanças do ticket nos painéis.
     * O parâmetro 'answersList' são os paineis de respostas já prontos com os ids e faltando as mudanças.
     * Ao final retorna todos os paineis com as mudanças já anexadas a eles.
     * 
     * @param {type} ticket
     * @param {type} answersList
     * @returns answersList
     */
    getChangesFromTicket: function(ticket, answersList) {
        var scope = this;
        var ticketId = ticket.data.id;
        var changesTicketStore = this.getChangesTicketStore();
        changesTicketStore.findByTicket(function(result) {
            if (result !== null && result.length > 0) {
                for (var i = 0; i < answersList.length; i++) {
                    var answer = answersList[i];
                    var idAnswer = answer.down('hiddenfield#idAnswer').text;
                    var changesContainer = answer.down('container#change');
                    var insertChange = false;
                    var item;
                    for (var j = 0; j < result.length; j++) {
                        var change = result[j];
                        var ticketAnswer = change.data.ticketAnswer;
                        insertChange = false;
                        // testa se a mudança foi antes de alguma resposta e se está no painel de resposta com a descrição do ticket
                        // ou se a mudança foi na resposta atual.
                        if ((idAnswer === 0 && ticketAnswer === null)
                                || ((idAnswer !== 0 && ticketAnswer !== null) && (parseInt(idAnswer) === (parseInt(ticketAnswer.id))))) {
                            insertChange = true;
                        }
                        if (insertChange) {
                            var containerChanges = answer.down('container#containerChanges');
                            containerChanges.setVisible(true);
                            var text = scope.getTextWithChangesTicket(change);
                            item = {
                                xtype: 'box',
                                html: text,
                                cls: 'box-ticket-changes'
                            };
                            changesContainer.insert(item);
                        }
                    }
                }
            }
        }, ticketId);
        return answersList;
    },
    getTextWithChangesTicket: function(param) {
        var textResponsible = translations.COMMENT_INTERNAL_BY + " ";
        var responsible = param.data.userName;
        var changeDate = new Date(param.data.dateCreation);
        changeDate = " - " + Ext.Date.format(changeDate, translations.FORMAT_DATE_TIME);
        var text = '';
        if (param !== null) {
            var change = param.data;
            var lengthText = 0;

            // formatando texto com mudança de estado ticket.
            if (change.newStateTicket !== null) {
                if (change.newStateTicket !== null) {
                    if (change.newStateTicket === false) {
                        text += translations.TICKET_CLOSED;
                    } else {
                        text += translations.TICKET_REOPENED;
                    }
                    text += ". ";
                }
            }
            lengthText += text.length;

            // formatando texto de mudança de responsável.
            if (change.newResponsible !== null || change.olderResponsible !== null) {
                text += translations.RESPONSIBLE_CHANGED_FROM;
                if (change.olderResponsible !== null) {
                    text += "\"" + change.olderResponsibleName + "\" ";
                } else {
                    text += "\"" + translations.NO_RESPONSIBLE + "\" ";
                }
                text += translations.FROM;
                if (change.newResponsible !== null) {
                    text += " \"" + change.newResponsibleName + "\"";
                } else {
                    text += " \"" + translations.NO_RESPONSIBLE + "\"";
                }
                text += ". ";
            }
            lengthText += text.length;

            // formatando texto de mudança de categoria
            if (change.newCategory !== null || change.olderCategory !== null) {
                text += translations.CATEGORY_CHANGED_FROM;
                if (change.olderCategory !== null) {
                    text += "\"" + change.olderCategoryName + "\" ";
                } else {
                    text += "\"" + translations.NO_CATEGORY + "\" ";
                }
                text += translations.FROM;
                if (change.newCategory !== null) {
                    text += " \"" + change.newCategoryName + "\"";
                } else {
                    text += " \"" + translations.NO_CATEGORY + "\"";
                }
                text += ". ";
            }
            lengthText += text.length;

            // formatando texto de mudança de prioridade
            if (change.newPriority !== null || change.olderPriority !== null) {
                text += translations.PRIORITY_CHANGED_FROM;
                if (change.olderPriority !== null) {
                    text += "\"" + change.olderPriorityName + "\" ";
                } else {
                    text += "\"" + translations.NO_PRIORITY + "\" ";
                }
                text += translations.FROM;
                if (change.newPriority !== null) {
                    text += " \"" + change.newPriorityName + "\"";
                } else {
                    text += " \"" + translations.NO_PRIORITY + "\"";
                }
                text += ". ";
            }
            lengthText += text.length;

            // formatando texto de mudança de prazo estimado.
            if (change.newEstimatedTime !== null || change.olderEstimatedTime !== null) {
                text += translations.ESTIMATED_TIME_CHANGED_FROM;
                var date;
                if (change.olderEstimatedTime !== null) { 
                    
                    var dateSpplited = change.olderEstimatedTime.split('-');
                    date = new Date(dateSpplited[0],dateSpplited[1]-1,dateSpplited[2]);
                    //date = new Date(change.olderEstimatedTime);                   
                    date = Ext.Date.format(date, translations.FORMAT_JUST_DATE);
                    text += "\"" + date + "\" ";
                } else {
                    text += "\"" + translations.NO_DEADLINE_DEFINED + "\" ";
                }
                text += translations.FROM;
                if (change.newEstimatedTime !== null) {
                    
                    var dateSpplited = change.newEstimatedTime.split('-');
                    date = new Date(dateSpplited[0],dateSpplited[1]-1,dateSpplited[2]);                    
                    //date = new Date(change.newEstimatedTime);                    
                    date = Ext.Date.format(date, translations.FORMAT_JUST_DATE);
                    text += " \"" + date + "\"";
                } else {
                    text += " \"" + translations.NO_DEADLINE_DEFINED + "\"";
                }
                text += ". ";
            }
        }
        
        text += "<br />";
        text += "<pre>"+textResponsible + "<b>"+responsible+"</b>" + changeDate+"</pre>";
        
        return text;

    },
    loadStoreBasic: function(urlSimples) {
        //loadStore to GRID
        var myscope = this;
        myscope.getTicketPanel().getStore().proxy.url = 'ticket/' + urlSimples + '-paging';
        myscope.getTicketPanel().getStore().load({
            params: {
                user: Helpdesk.Globals.userLogged.userName,
                start: 0,
                limit: Helpdesk.Globals.pageSizeGrid
            },
            callback: function() {
                myscope.backToDefaultStore(myscope);
                myscope.setSideMenuButtonText();
                //loadStore to toolbar
                var toolbar = myscope.getTicketPanel().getDockedItems()[1];
                toolbar.getStore().proxy.url = 'ticket/' + urlSimples;
                toolbar.getStore().load({
                    params: {
                        user: Helpdesk.Globals.userLogged.userName
                    },
                    callback: function() {
                        toolbar.getStore().proxy.url = 'ticket';
                    }
                });
            }
        });

    },
    downloadFile: function(fileId) {
        Ext.core.DomHelper.append(document.body, {
            tag: 'iframe',
            id: 'downloadIframe',
            style: 'display:none;',
            src: 'attachments/attachments/' + fileId
        });
    },
        submitValues: function(multiupload) {
        var scope = this;
        var ticketView = scope.getTicketView();
        if (multiupload.filesListArchive.length > 0) {
            var time = new Date().getTime();
            var userLogadoText = Ext.DomHelper.append(Ext.getBody(), '<input type="text" name="username" value="' + Helpdesk.Globals.userLogged.userName + '">');
            //Criação do form para upload de arquivos
            var formId = 'fileupload-form-' + time;
            var formEl = Ext.DomHelper.append(Ext.getBody(), '<form id="' + formId + '" method="POST" action="attachments/attachments" enctype="multipart/form-data" class="x-hide-display"></form>');
            formEl.appendChild(userLogadoText);
            Ext.each(multiupload.filesListArchive, function(fileField) {
                formEl.appendChild(fileField);
            });

            var form = $("#" + formId);
            form.ajaxForm({
                beforeSend: function() {

                },
                uploadProgress: function(event, position, total, percentComplete) {
                    ticketView.setLoading(translations.UPLOADING_FILES + percentComplete + '%');
                },
                success: function() {

                },
                complete: function(xhr) {
                    var responseJSON = Ext.decode(xhr.responseText);
                    if (responseJSON.success) {
                        ticketView.setLoading(translations.SAVING_TICKET);
                        scope.saveTicket();
                    }
                    else {
                        ticketView.setLoading(false);
                        console.info("ERRO UPLOAD FILE");
                    }
                }
            });
            form.submit();
            //Clear Fields
            multiupload.filesListArchive.length = 0;
            multiupload.fileslist.length = 0;
            multiupload.doLayout();
        }
        else {
            ticketView.setLoading(translations.SAVING_TICKET);
            scope.saveTicket();
        }
    }
});