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
        'ticket.Ticket','ticket.NewTicket','ticket.TicketDetails','ticket.TicketAnswerPanel'
    ],      
    stores : ['Tickets','TicketAnswers','Clients','UsersAdmin','Reports'],
    requires: ['Helpdesk.store.Tickets','Helpdesk.store.TicketAnswers','Helpdesk.store.Clients','Helpdesk.store.UsersAdmin','Helpdesk.store.Reports'],
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
            '#addNewClient':{
                click: this.onAddNewClient
            },
            'clientcadastre button#save': {
                click: this.onSaveNewClient
            },            
            '#ticketgrid':{
                itemdblclick: this.ticketClicked
            },
            'button#editTicket':{
                click: this.editTicket
            },      
            'ticket combobox#cmbSearch':{  
                change:this.changeCmbSearch,
                buffer: 1000
            },
            'ticketgrid pagingtoolbar#dockedItem':{
                beforechange:this.changeGridPage
            },
            'editticket button#btnSaveEditTicket':{
                click:this.onSaveTicketChanges
            },
            'ticketdetails button':{
                click:this.setStatusTicket
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
            ref:'ticketDetailsView',
            selector:'ticketdetails'
        },
        {
            ref:'ticketView',
            selector:'ticket'
        }
        
    ],
    list: function() {
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.ticketview);
        this.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_view);
        if(typeof this.getTicketPanel() !== 'undefined'){
            this.getTicketsEmAndamento();            
        }
        else{
            this.setSideMenuButtonText();
        }
        var mainHeader = this.getMainHeader();
        var btnTicket = mainHeader.down("#ticket");
        btnTicket.toggle(true);
    },
    
    /**
     *Fecha o ticket 
     */
    closeTicket:function(button){
        var scope = this;
        var record = button.up('form#ticketMainView').getRecord();
        record.dirty = true;
        var store = this.getTicketsStore();
        store.proxy.url = 'ticket/close-ticket';
        store.add(record);
        store.sync({            
            callback:function(){
                store.proxy.url = 'ticket';
                scope.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_datagrid);
                scope.setSideMenuButtonText();
            }
        });
    },
        //Fecha ou abre o ticket
    setStatusTicket:function(button){        
        if(button.id === 'btnCloseTkt' || button.id === 'btnOpenTkt'){        
            
            var scope = this;
            var record = button.up('form#ticketMainView').getRecord();
            record.dirty = true;
            var store = this.getTicketsStore();
            
            if(button.id === 'btnCloseTkt'){
                store.proxy.url = 'ticket/close-ticket';
            }else if(button.id === 'btnOpenTkt'){
                store.proxy.url = 'ticket/open-ticket';
            }
            store.add(record);
            store.sync({            
                callback:function(){
                    store.proxy.url = 'ticket';
                    scope.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_datagrid);
                    scope.setSideMenuButtonText();
                    scope.atualizaGrid();
                }
            });
        }
    },

    /**
     * Salva as alterações do ticket
     * 
     */
    onSaveTicketChanges:function(button){
        var myScope = this;
        var mainView = this.getTicketView();
        var form = button.up('form#ticketMainView');        
        var record = button.up('form#ticketMainView').getRecord() ;
        mainView.setLoading('Salvando...');
        if(form.down('combobox#priorityTicket').getValue()===null || form.down('combobox#priorityTicket').getValue()===''){
            var priorityIndex = Ext.StoreMgr.lookup(form.down('combobox#priorityTicket').getStore()).findExact('name',translations.NO_PRIORITY);
            var priorityRecord = Ext.StoreMgr.lookup(form.down('combobox#priorityTicket').getStore()).getAt(priorityIndex);            
            form.down('combobox#priorityTicket').setValue(priorityRecord);
            record.data.priority = this.getRecordFromComboBox(form.down('combobox#priorityTicket').getStore(),form.down('combobox#priorityTicket').getValue());
        }else{
            record.data.priority = this.getRecordFromComboBox(form.down('combobox#priorityTicket').getStore(),form.down('combobox#priorityTicket').getValue());
        }
        
        record.data.category = this.getRecordFromComboBox(form.down('combobox#categoryTicket').getStore(),form.down('combobox#categoryTicket').getValue());
        //Se nenhuma categoria tiver sido marcada, o ticket recebe "Sem categoria"
        if(typeof record.data.category === 'undefined'){
            record.data.category = form.down('combobox#categoryTicket').getStore().data.items[4].data;            
        }
        record.data.responsavel = this.getRecordFromComboBox(form.down('combobox#responsibleTicket').getStore(),form.down('combobox#responsibleTicket').getValue());
        record.data.stepsTicket = form.down('textarea#stepsTicket').getValue();
        record.data.estimateTime = form.down('datefield#estimateTime').getValue(); //Ext.Date.format(form.down('datefield#estimateTime').getValue(),'d/m/Y');
                
        record.dirty = true;        
        var store = this.getTicketsStore(); 
        store.add(record);
        if (store.getModifiedRecords().length > 0) {
            store.sync({
                callback:function(){                    
                    myScope.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_view);                    
                    myScope.setValuesFromView(form.up(),record);
                    mainView.setLoading(false);
                }
            });
        }else{  
            mainView.setLoading(false);
            Ext.Msg.alert(translations.INFORMATION,translations.NOTHING_TO_SAVE);
        }
        
    },  
    //Retorna o record selecionado no combobox
    getRecordFromComboBox:function(store,idSelected){        
        if(store!==null && idSelected!== null){
            for(var i=0;i<store.getCount();i++){
                if(store.data.items[i].data.id === idSelected){
                    return store.data.items[i].data;
                }
            };
            return null;
        }        
    },
    
    /**
     * Faz a paginação do grid de tickets de acordo com a página selecionada
     */    
    changeGridPage:function(toolbar,page){        
        var myscope = this;
        var limit = (page)*Helpdesk.Globals.pageSizeGrid;
        var start = limit-Helpdesk.Globals.pageSizeGrid;
        
        myscope.getTicketPanel().getStore().proxy.url = this.getProxy() + '-paging' ; 
        myscope.getTicketPanel().getStore().load({
            params:{
                user: Helpdesk.Globals.user,
                start: start,
                limit: limit
            },
            callback: function(){               
                myscope.backToDefaultStore(myscope);
                myscope.setSideMenuButtonText();
            }
        }); 
    },
    
    getProxy:function(){
        
        var form = this.getTicketSideMenu();
        
        if(form.down('button#buttonAll').pressed === true){
            return 'ticket/all';    
        }else if(form.down('button#buttonMyTickets').pressed === true){
            return 'ticket/mytickets';    
        }else if(form.down('button#buttonWithoutResponsible').pressed === true){
            return 'ticket/withoutresponsible';    
        }else if(form.down('button#buttonOpened').pressed === true){
            return 'ticket/opened';    
        }else if(form.down('button#buttonClosed').pressed === true){
            return 'ticket/closed';    
        }else{
            return 'ticket/all';   
        } 
    },  
    
    changeCmbSearch:function(field,newValue, oldValue, eOpts){
        //The method will be executed only if the new value have at least 3 characters
        var scope = this;
        var store = field.up('container#maincontainer').down('#ticketgrid').getStore();
        var grid = field.up('container#maincontainer').down('#ticketgrid');
        var form = this.getTicketSideMenu();         
        if(newValue!== null){           
            field.up('container#maincontainer').down('#ticketgrid').setLoading(true);
            store.removeAll();            
            var storeTemp = new Helpdesk.store.Tickets(); 
            storeTemp.proxy.url = this.getProxy();
            storeTemp.load({
                params:{
                    user: Helpdesk.Globals.user
                },
                callback:function(){  
                    field.up('container#maincontainer').down('#ticketgrid').setLoading(false);
                    for(var i=0;i<storeTemp.getCount();i++){            
                        if(storeTemp.data.items[i].data.client.name.toLowerCase().indexOf(newValue.toLowerCase()) > -1){                
                            store.add(storeTemp.data.items[i].data);                        
                        }else if(storeTemp.data.items[i].data.title.toLowerCase().indexOf(newValue.toLowerCase()) > -1){
                            store.add(storeTemp.data.items[i].data);     
                        }else if(storeTemp.data.items[i].data.category.name.toLowerCase().indexOf(newValue.toLowerCase()) > -1){
                            store.add(storeTemp.data.items[i].data);     
                        }else if(storeTemp.data.items[i].data.user.name.toLowerCase().indexOf(newValue.toLowerCase()) > -1){
                            store.add(storeTemp.data.items[i].data);     
                        }else if(storeTemp.data.items[i].data.isOpen===true){
                            if(translations.OPENED.toLowerCase().indexOf(newValue.toLowerCase()) > -1){
                                store.add(storeTemp.data.items[i].data);
                            }
                        }else if(storeTemp.data.items[i].data.isOpen===false){
                            if(translations.CLOSED.toLowerCase().indexOf(newValue.toLowerCase()) > -1){
                                store.add(storeTemp.data.items[i].data);
                            }
                        }
                    }
                    if(store.getCount()===0 && newValue === ''){
                        for(var i=0;i<storeTemp.getCount();i++){          
                            store.add(storeTemp.data.items[i].data);                             
                        }
                    }
                    //Selects the matching values on the grid
                    scope.onTextFieldChange(newValue,store,grid); 
                }
            });
        }else{
            store.proxy.url = this.getProxy();
            store.load({
                params:{
                    user: Helpdesk.Globals.user,
                    start:0,
                    limit:Helpdesk.Globals.pageSizeGrid
                },
                callback:function(){
                    store.proxy.url = 'ticket'; 
                }
            });
        }
    },
    
    
    /**
     * Finds all strings that matches the searched value in each grid cells.     * 
     */
    onTextFieldChange:function(searchValue,store,grid) {
        
        var tagsRe = /<[^>]*>/gm;
        var tagsProtect = '\x0f';       
        var searchRegExp = new RegExp(searchValue, 'g' + (false ? '' : 'i'));
        var count = 0;
        var indexes = [];
        var currentIndex = null;
        store.each(function(record, idx) {
            
            var td = Ext.fly(grid.view.getNode(idx)).down('td'),
            cell, matches, cellHTML;     
            
            while(td) {
                cell = td.down('.x-grid-cell-inner');
                matches = cell.dom.innerHTML.match(tagsRe);
                cellHTML = cell.dom.innerHTML.replace(tagsRe,tagsProtect);
                
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
    atualizaGrid:function(){
        var button;        
        var sideMenu = this.getTicketSideMenu();
        
        if(sideMenu.down('button#buttonAll').pressed === true){
            button = sideMenu.down('button#buttonAll');
        }else if(sideMenu.down('button#buttonOpened').pressed === true){
            button = sideMenu.down('button#buttonOpened');
        }else if(sideMenu.down('button#buttonClosed').pressed === true){
            button = sideMenu.down('button#buttonClosed');
        }else if(sideMenu.down('button#buttonMyTickets').pressed === true){
            button = sideMenu.down('button#buttonMyTickets');
        }else if(sideMenu.down('button#buttonWithoutResponsible').pressed === true){
            button = sideMenu.down('button#buttonWithoutResponsible');
        }
        if(button!== null){
            this.onTicketMenuClick(button);
        }
        
    },

    initDashView:function(){
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.ticketview);        
        this.setSideMenuButtonText();
    },
    
    /**
     * Açoes realizadas por cada side button 
     */
    onTicketMenuClick: function(btn){
        this.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_datagrid);
        this.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_view);
        if(typeof this.getTicketPanel() !== 'undefined'){
            if(btn.itemId === 'buttonAll'){
                this.getAllTickets();
            }
            else if(btn.itemId === 'buttonOpened'){
                this.getTicketsEmAndamento();
            }
            else if(btn.itemId === 'buttonClosed'){
                this.getTicketsFechado();     
            }  
            else if(btn.itemId === 'buttonMyTickets'){
                this.getMeusTickets();     
            }  
            else if(btn.itemId === 'buttonWithoutResponsible'){
                this.getTicketsSemResponsavel();     
            }  
        }
    },
    
    /**
     * Retorna o proxy da store de Ticket para o default
     */
    backToDefaultStore: function(scope){
        scope.getTicketPanel().getStore().proxy.url = 'ticket';
    },
    
    /**
     * Busca todos os Tickets
     */
    getAllTickets: function(){
        this.loadStoreBasic('all');
    },
    
    /**
     * Busca todos os tickets ABERTOS
     */
    getTicketsEmAndamento: function(){
        this.loadStoreBasic('opened');
    },
    /**
     * Busca todos os tickets FECHADOS
     */
    getTicketsFechado: function(){
        this.loadStoreBasic('closed');
    },
    
    /**
     * Busca todos os tickets em que o usuario logado é o responsavel
     */
    getMeusTickets: function(){
        this.loadStoreBasic('mytickets');
    },
    
    /**
     * Busca todos os tickets em que não tenha responsavel 
     */
    getTicketsSemResponsavel: function(){
        this.loadStoreBasic('withoutresponsible');
    },
    
    /**
     * Busca e preenche as informações do sidemenu (Quantidade de tickets em cada categoria),
     * e seta visibilidade dos botões de acorodo com o perfil utilizado
     */
    setSideMenuButtonText: function(){
        var myscope = this;
        Ext.Ajax.request({
            url: 'ticket/textmenu',
            method: 'GET',
            async:false,
            params: {
                user : Helpdesk.Globals.user
            },
            success: function(o) {
                var decodedString = Ext.decode(o.responseText);
                
                var sm = myscope.getTicketSideMenu();
                var buttonAll = sm.down('#buttonAll');
                var buttonOpened = sm.down('#buttonOpened');
                var buttonClosed = sm.down('#buttonClosed');
                var buttonMyTickets = sm.down('#buttonMyTickets');
                var buttonWithoutResponsible = sm.down('#buttonWithoutResponsible');
                buttonAll.setText(translations.ALL +((decodedString.todos==='0')?(" "):(" ("+decodedString.todos+")")));  
                buttonOpened.setText(translations.IN_PROGRESS +((decodedString.abertos==='0')?(" "):(" ("+decodedString.abertos+")"))); 
                buttonClosed.setText(translations.CLOSED+((decodedString.fechados==='0')?(" "):(" ("+decodedString.fechados+")"))); 
                buttonMyTickets.setText(translations.MY_TICKETS+((decodedString.mytickets === '0')?(" "):(" ("+decodedString.mytickets+")"))); 
                buttonWithoutResponsible.setText(translations.WITHOUT_RESPONSIBLE+((decodedString.withoutresponsible==='0')?(" "):(" ("+decodedString.withoutresponsible+")"))); 
                if(Helpdesk.Globals.userGroup === "1"){//superusuario
                    buttonAll.setVisible(true);
                    buttonOpened.setVisible(true);
                    buttonClosed.setVisible(true);
                    buttonMyTickets.setVisible(true);
                    buttonWithoutResponsible.setVisible(true);
                }
                else{//outros
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
    onCriarTicket: function(){
        this.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_new);
    },
    
    saveNewTicket: function(button, e, options) {
        var ticketView = this.getTicketView();
        //upload arquivos, caso seja success, salva o novo ticket
        var multiupload = ticketView.down('multiupload');
        this.submitValues(multiupload);
    },
    
    saveTicket: function(){
        var scope = this;
        var ticketView = scope.getTicketView();      
        var form = ticketView.down('form');
        var record = form.getRecord();
        var values = form.getValues();
        
        
        record.set(values);
        record.data.startDate = new Date();
        record.data.endDate = null;
        record.data.user = Helpdesk.Globals.userLogged;
        record.data.isOpen = true;   
        
        if(form.down('combobox#responsibleTicket').rawValue===''){
            record.data.responsavel = null;
            record.data.responsavelName = null;
        }
        
        if(form.down('combobox#priorityCmb').rawValue===''){
            record.data.priority = null;
            record.data.priorityName = null;
        }
        

        if(Helpdesk.Globals.userLogged.id !== 1){
            record.data.responsavel = null;
            record.data.priority = null;
            record.data.estimateTime = null;
            record.data.client = Helpdesk.Globals.userLogged.client;           
        }
        
        var check = false;
            if(record.data.user.userGroup.id === 1){
                if(form.down('combobox#clientName').rawValue!=='' && 
                   form.down('combobox#categoryTicket').rawValue!=='' &&
                   form.down('textarea#stepsTicket').value!=='' && 
                   form.down('textfield#subject').value!=='' && 
                   form.down('textarea#description').value!==''){
                    check = true;
                }
            }else if(record.data.user.userGroup.id === 2){
                if(form.down('combobox#categoryTicket').rawValue!=='' && 
                   form.down('textarea#stepsTicket').value!=='' && 
                   form.down('textfield#subject').value!=='' && 
                   form.down('textarea#description').value!==''){
                    check = true;
                }
            }
            if(check){         
            this.getTicketPanel().getStore().add(record);
            if (this.getTicketPanel().getStore().getModifiedRecords().length > 0) {
                this.getTicketPanel().getStore().sync({
                    callback: function(records,operation,success) {
                        form.getForm().reset();                    
                        scope.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_datagrid);
                        scope.setSideMenuButtonText();
                        ticketView.setLoading(false);
                    }
                });          
            } else {
                Ext.Msg.alert(translations.INFORMATION, translations.NOTHING_TO_SAVE);
                ticketView.setLoading(false);
            }
        }else{
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
     *     
     */
    ticketClicked:function(grid, record, item, index, e, eOpts){
        var ticketView = this.getTicketCardContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details);        
        ticketView.down('form#ticketMainView').loadRecord(Ext.create('Helpdesk.model.Ticket'));      
        this.setValuesFromView(ticketView,record);   
    },
    
  /**
     * @author Ricardo
     * 
     * Insere os valores na view de cadastro de ticket
     */
    setValuesFromView:function(ticketView,record){
        var scope = this;
        if(ticketView !== null && record !== null){
            
            ticketView.down('form#ticketMainView').loadRecord(record);           
            
            ticketView.down('text#tktTitle').setText(translations.TICKET+' #'+record.data.id+' - '+record.data.title);
            if(record.data.isOpen)
                ticketView.down('text#tktStatus').setText(translations.TICKET_TITLE_OPENED);
            else
                ticketView.down('text#tktStatus').setText(translations.TICKET_TITLE_CLOSED);
            
            ticketView.down('text#tktBy').setText(record.data.userName);
            
            //formata data Inicial do ticket
            var dateTemp = new Date(record.data.startDate);
            dateTemp = Ext.Date.format(dateTemp ,'d/m/Y');         
            ticketView.down('text#tktAt').setText(dateTemp);
            
            ticketView.down('text#tktCategory').setText(record.data.categoryName);
            if(record.data.estimateTime!==null){
                record.data.estimateTime = new Date(record.data.estimateTime);
                record.data.estimateTime = Ext.Date.format(record.data.estimateTime ,'d/m/Y');
                ticketView.down('text#tktEstimatedTime').setText(record.data.estimateTime);
            }else{
                ticketView.down('text#tktEstimatedTime').setText(translations.NO_DEADLINE_DEFINED);
            }            
            
            
            if(record.data.priorityName!==null && record.data.priorityName!==''){
                ticketView.down('text#tktPriority').setText(record.data.priorityName);
            }else{
                ticketView.down('text#tktPriority').setText(translations.NO_PRIORITY);
            }
            
            
            if(record.data.responsavelName!==null && record.data.responsavelName!==''){
                ticketView.down('text#tktResponsible').setText(record.data.responsavelName);
            }else{
                ticketView.down('text#tktResponsible').setText(translations.NO_RESPONSIBLE);
            }
            ticketView.down('text#tktSteps').setText(record.data.stepsTicket);          
            
            //Insere a descrição do ticket            
            ticketView.down('panel#tktAnswers').removeAll(true);                  
            
            //Recebe todas as respostas do ticket
            var answerStore = this.getTicketAnswersStore();             
            answerStore.proxy.url = 'ticket-answer/find-by-ticket/'+record.data.id;
            answerStore.load({
                callback:function(){ 
                    var resposta =  Ext.create('Helpdesk.view.ticket.TicketAnswerPanel',{
                        title:record.data.userName
                    });
                    resposta.down('label#corpo').text = record.data.description;
                    resposta.down('hiddenfield#id').text = record.data.id;
                    resposta.down('hiddenfield#idAnswer').text  = 0;
                    
                    ticketView.down('panel#tktAnswers').items.add(resposta);
                    for(i=0;i<answerStore.getCount();i++){          
                        resposta =  Ext.create('Helpdesk.view.ticket.TicketAnswerPanel',{
                            title:answerStore.data.items[i].data.user.name
                        });              
                        resposta.down('label#corpo').text = answerStore.data.items[i].data.description;
                        resposta.down('hiddenfield#id').text = record.data.id;
                        resposta.down('hiddenfield#idAnswer').text  = answerStore.data.items[i].data.id;
                        ticketView.down('panel#tktAnswers').items.add(resposta);                       
                    }
                    ticketView.down('panel#tktAnswers').doLayout(); 
                    scope.getFilesFromRecord(ticketView,record);
                }
            });
        }        
        //Seta a visibilidade dos botões de fechar ou abrir tickets de acordo com o ticket corrente
        
        if(record.data.isOpen === true){            
            ticketView.down('label#lblTicketOpen').setVisible(true);
            ticketView.down('button#btnCloseTkt').setVisible(true);
            ticketView.down('label#lblTicketClosed').setVisible(false);
            ticketView.down('button#btnOpenTkt').setVisible(false);
            //Seta visibilidade do botão salvar
            ticketView.down('button#btnSaveAnswTkt').setVisible(true);
            //Seta a visibilidade do botão de edição do ticket
            if(Helpdesk.Globals.userLogged.userGroup.id === 1){
                ticketView.down('button#editTicket').show();
            }
        }
        else{            
            ticketView.down('label#lblTicketOpen').setVisible(false);
            ticketView.down('button#btnCloseTkt').setVisible(false);            
            ticketView.down('label#lblTicketClosed').setVisible(true);            
            ticketView.down('button#btnOpenTkt').setVisible(true);
            //Seta visibilidade do botão salvar
            ticketView.down('button#btnSaveAnswTkt').setVisible(false);           
            //Seta a visibilidade do botão de edição do ticket
            ticketView.down('button#editTicket').hide();
            
            
            
            
        }
    },
    
    /*
     * Muda CardContainer para a view de Edição do ticket.
     * Seta os valores do ticket na tela de edição
     */
    editTicket:function(button, e, options){ 
        var ticketView = this.getTicketEditContainer();
        this.getTicketEditContainer().getLayout().setActiveItem(Helpdesk.Globals.ticket_details_edit);
        
        //set category combobox
        var categoryText = ticketView.down('#tktCategory').text;
        var categoryCombo = ticketView.down('#categoryTicket');
        var categoryStore = categoryCombo.store;
        var categoryIndex = Ext.StoreMgr.lookup(categoryStore).findExact('name',categoryText);
        var categoryRecord = Ext.StoreMgr.lookup(categoryStore).getAt(categoryIndex);
        categoryCombo.setValue(categoryRecord);
        
        //set responsavel combobox        
        var responsavelText = ticketView.down('#tktResponsible').text;
        var responsavelCombo = ticketView.down('#responsibleTicket');
        var responsavelStore = responsavelCombo.store;
        var resposibleTemp;
        if(responsavelText ===''){            
            resposibleTemp = new Helpdesk.model.User();
            resposibleTemp.data.name = translations.NO_RESPONSIBLE;
            responsavelCombo.setValue(resposibleTemp);
        }
        else{
            var responsavelIndex = Ext.StoreMgr.lookup(responsavelStore).findExact('name',responsavelText);
            var responsavelRecord = Ext.StoreMgr.lookup(responsavelStore).getAt(responsavelIndex);
            responsavelCombo.setValue(responsavelRecord);
        }
        
        //set priority combobox
        var priorityText = ticketView.down('#tktPriority').text;
        var priorityCombo = ticketView.down('#priorityTicket');
        var priorityStore = priorityCombo.store;
        var priorityIndex = Ext.StoreMgr.lookup(priorityStore).findExact('name',priorityText);
        var priorityRecord = Ext.StoreMgr.lookup(priorityStore).getAt(priorityIndex);
        priorityCombo.setValue(priorityRecord);
        
        //set prazo datefield       
        var estimatedText = ticketView.down('#tktEstimatedTime').text;        
        if(estimatedText !== '' && estimatedText!==translations.NO_DEADLINE_DEFINED){
            //var estimatedDate = new Date(estimatedText);
            var estimatedDateField = ticketView.down('#estimateTime');
            //estimatedDateField.setValue(estimatedDate);
            estimatedDateField.setValue(estimatedText);
        }
        
        //set steps textarea
        var stepsText = ticketView.down('#tktSteps').text;
        ticketView.down('#stepsTicket').setValue(stepsText);
        
    },
    getFilesFromRecord:function(ticketView,record){
        var scope = this;
        if(ticketView !== null && record !== null){   
            var ticketId = record.data.id;
            Ext.Ajax.request({
                url: 'ticket/'+ticketId+'/files',
                method: 'GET',
                success: function (response, opts) {
                    if(response.responseText !== ''){
                        var responseJSON = Ext.decode(response.responseText);
                        var answersList = ticketView.down('panel#tktAnswers').items.items;
                        
                        for (var i = 0; i < answersList.length; i++){
                            var answer = answersList[i];
                            var idAnswer = answer.down('hiddenfield#idAnswer').text;
                            var idTicket = answer.down('hiddenfield#id').text;
                            var fileContainer = answer.down('container#anexo');
                            for (var j = 0; j < responseJSON.length; j++){
                                var file = responseJSON[j];
                                var fileIdTicket = file.fileTicketId;
                                var fileIdAnswer = file.fileTicketAnswerId;
                                var fileName = file.fileName;
                                var fileId = file.fileId;
                                var insertAnexo = false;
                                if(idAnswer === 0){
                                    if(fileIdAnswer === '' && fileIdTicket == idTicket){
                                        insertAnexo = true;
                                    }
                                }
                                else{
                                    if(fileIdAnswer == idAnswer){
                                        insertAnexo = true;
                                    }
                                }
                                if(insertAnexo){
                                    var linkButton = {
                                        xtype : 'button',
                                        text : fileName,
                                        fileId: fileId,
                                        cls: 'btn-linkbutton-custom',
                                        iconCls: 'clip',
                                        listeners : {
                                            click : function(button, e, eOpts){
                                                scope.downloadFile(button.fileId);
                                            }
                                        }
                                    }
                                    fileContainer.insert(linkButton);
                                }
                            }
                        }
                    }
                }
            });
        }
    },
    
    loadStoreBasic:function(urlSimples){
        //loadStore to GRID
        var myscope = this;        
        myscope.getTicketPanel().getStore().proxy.url = 'ticket/'+urlSimples+'-paging';
        myscope.getTicketPanel().getStore().load({
            params:{
                user: Helpdesk.Globals.user,
                start:0,
                limit:Helpdesk.Globals.pageSizeGrid
            },
            callback: function(){
                myscope.backToDefaultStore(myscope);
                myscope.setSideMenuButtonText(); 
                //loadStore to toolbar
                var toolbar = myscope.getTicketPanel().getDockedItems()[1];                
                toolbar.getStore().proxy.url = 'ticket/'+urlSimples;
                toolbar.getStore().load({
                    params:{
                        user: Helpdesk.Globals.user          
                    },
                    callback:function(){
                        toolbar.getStore().proxy.url = 'ticket';
                    }
                });
            }
        });
        
    },
    
    downloadFile:function(fileId){
        Ext.core.DomHelper.append(document.body, {
            tag : 'iframe',
            id : 'downloadIframe',
            style : 'display:none;',
            src : 'ticket/files/'+fileId
        });
    },
    submitValues: function(multiupload) {
        var scope = this;
        var ticketView = scope.getTicketView();
        if (multiupload.filesListArchive.length > 0) {
            var time = new Date().getTime();
            var userLogadoText = Ext.DomHelper.append(Ext.getBody(),'<input type="text" name="username" value="'+Helpdesk.Globals.user+'">');
            //Criação do form para upload de arquivos
            var formId = 'fileupload-form-' + time;
            var formEl = Ext.DomHelper.append(Ext.getBody(), '<form id="' + formId + '" method="POST" action="ticket/files" enctype="multipart/form-data" class="x-hide-display"></form>');
            formEl.appendChild(userLogadoText);
            Ext.each(multiupload.filesListArchive, function(fileField) {
                formEl.appendChild(fileField);
            });
            
            
            var form = $("#"+formId);
            form.ajaxForm({
                beforeSend: function() {
                    
                },
                uploadProgress: function(event, position, total, percentComplete) {                    
                    ticketView.setLoading('Uploading Files ... '+percentComplete+'%');
                },
                success: function() {
                                      
                },
                complete: function(xhr) {                    
                    var responseJSON = Ext.decode(xhr.responseText);
                    if(responseJSON.success){                        
                        ticketView.setLoading('Saving Ticket ...');
                        scope.saveTicket();
                    }
                    else{
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
        else{
            ticketView.setLoading('Saving Ticket ...');
            scope.saveTicket();
        }

    }
});