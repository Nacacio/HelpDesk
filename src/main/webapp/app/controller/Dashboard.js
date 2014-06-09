Ext.define('Helpdesk.controller.Dashboard', {
    requires:[
        'Helpdesk.store.Users',
        'Helpdesk.store.Tickets',
        'Helpdesk.store.TicketsFromUser',
        'Helpdesk.store.TicketsStatus',
        'Helpdesk.store.Categorys',
        'Helpdesk.store.TicketsOngoingClient',
        'Helpdesk.store.TicketsOngoingAgent'
        
    ],
    extend: 'Ext.app.Controller',
    stores: [
        'Users',
        'Tickets',
        'TicketsFromUser',
        'TicketsStatus',
        'TicketsByCategory',
        'Categorys',
        'TicketsOngoingClient',
        'TicketsOngoingAgent'
    ],
    views: [
        'dashboard.Dashboard',
        'dashboard.TableTicketInformation',
        'ticket.Ticket'
    ],
    init: function() {
        this.control({
           'dashboard':{
               afterrender:this.setChartsAndView
           },
           'tableticket button':{
               click:this.changeView
           }
        });
    },
    refs: [
        {
            ref: 'tableTicket',
            selector: 'dashboard'
        },
        {
            ref:'ticketSide',
            selector:'ticket > ticketsidemenu'
        },
        {
            ref: 'ticketPanel',
            selector: 'ticket #ticketgrid'
        },
    ], 
    
    /**
     * 
     * @param {type} form
     * @returns {undefined}
     * Change the view according the selected button on the dashboard
     */
    changeView:function(button){        
        Ext.Router.redirect('ticket-dash');        
        this.removeSelection();
        if(button.itemId === 'btnDashboardNoResp'){
            this.getTicketsSemResponsavel();            
        }else if(button.itemId === 'btnDashboardLate'){
            this.getTicketsEmAndamento();            
        }else if(button.itemId === 'btnDashboardNoCat'){            
            this.getAllTickets();
        }        
    },
    
    removeSelection:function(){       
        this.getTicketSide().down('button#buttonSemResponsavel').toggle(false);
        this.getTicketSide().down('button#buttonMeusTickets').toggle(false);
        this.getTicketSide().down('button#buttonEmAndamento').toggle(false);
        this.getTicketSide().down('button#buttonFechado').toggle(false);
        this.getTicketSide().down('button#buttonTodos').toggle(false);        
    },
    
    getTicketsSemResponsavel: function(){
        var myscope = this;
        
        myscope.getTicketPanel().getStore().proxy.url = 'ticket/withoutresponsible';
        myscope.getTicketPanel().getStore().load({
            params:{
                user: Helpdesk.Globals.user
            },
            callback: function(){
                myscope.getTicketSide().down('button#buttonSemResponsavel').toggle(true);
                //myscope.backToDefaultStore(myscope);
            }
        });
    },
    
    getTicketsEmAndamento: function(){
        var myscope = this;
        
        myscope.getTicketPanel().getStore().proxy.url = 'ticket/opened';
        myscope.getTicketPanel().getStore().load({
            params:{
                user: Helpdesk.Globals.user
            },
            callback: function(){
                myscope.getTicketSide().down('button#buttonEmAndamento').toggle(true);
                myscope.backToDefaultStore(myscope);                
            }
        });
    },
    
    getAllTickets: function(){
        var myscope = this;
        
        myscope.getTicketPanel().getStore().proxy.url = 'ticket/all';
        myscope.getTicketPanel().getStore().load({
            params:{
                user: Helpdesk.Globals.user
            },
            callback: function(){                
                myscope.getTicketSide().down('button#buttonTodos').toggle(true);
                myscope.backToDefaultStore(myscope);                
            }
        });
    },
    
    /**
     * 
     * @param {type} form
     * @returns {undefined}
     * Call the methods that sets the view
     */
    setChartsAndView:function(form){        
        this.setCharUsers();
        this.setChartTicketsStatus();
        this.setChartCategory();
        this.setView(form);
        this.setInformationTable();
    },
    
    /**
     * 
     * @returns {undefined}
     * Sets the values from the table of users
     */
    setInformationTable:function(){
        var countCategory = 0;
        var countUser = 0;        
        var form = this.getTableTicket().down('tableticket');
        var scope = this;
        
        var store = this.getTicketsStore();
        store.load({
            callback:function(){
                for(var i=0;i<store.getCount();i++){                    
                    if(store.data.items[i].data.category === null){
                        countCategory++;
                    }
                    if(store.data.items[i].data.user === null){
                        countUser++;
                    }
                }
                if(countCategory===0){
                    form.down('panel#noRespCat').update('0');
                }else{
                    form.down('panel#noRespCat').update(countCategory);
                }
                if(countUser === 0){
                    form.down('panel#noRespHtml').update('0');
                }else{
                    form.down('panel#noRespHtml').update(countUser);
                }
                form.down('panel#noRespLate').update('0');
                
                //Alimenta a store dos data grids
                scope.setDataGridsTable(store);                
            }
        });       
    },
    
    /**
     * 
     * @param {type} ticketsStore
     * @returns {undefined}
     * Sets the values from the grids of clients and agents
     */
    setDataGridsTable:function(ticketsStore){
        var userStore = this.getUsersStore();        
        var scope = this;
        userStore.load({
            callback:function(){
                
                for(var i=0;i<userStore.getCount();i++){
                    var countAgent = 0;
                    var countClient = 0;
                    for(var k=0;k<ticketsStore.getCount();k++){
                        if(userStore.data.items[i].data.id === ticketsStore.data.items[k].data.user.id ){
                            
                            if(userStore.data.items[i].data.userGroup.id === 1 && ticketsStore.data.items[k].data.isOpen === true){
                                countAgent++;
                            }
                            if(userStore.data.items[i].data.userGroup.id === 2 && ticketsStore.data.items[k].data.isOpen === true){
                                countClient++;
                            }
                        }
                    }
                    if(userStore.data.items[i].data.userGroup.id === 1){
                        var object = new Helpdesk.model.TicketsByUser();
                        object.data.user = userStore.data.items[i].data.name;
                        object.data.ticketCount = countAgent;                    
                        scope.getTableTicket().down('datagridagent').getStore().add(object);                          
                    }
                    if(userStore.data.items[i].data.userGroup.id === 2){
                        var objectTemp = new Helpdesk.model.TicketsByUser();
                        objectTemp.data.user = userStore.data.items[i].data.name;
                        objectTemp.data.ticketCount = countClient;                    
                        scope.getTableTicket().down('datagridclient').getStore().add(objectTemp);                       
                    }
                }
                
            }
        });
    },
    
    /**
     * 
     * @returns {undefined}
     * Sets the values from the categories chart
     */
    setChartCategory:function(){
        
        var store = this.getTicketsByCategoryStore();        
        var storeCategories = this.getCategorysStore();
        var storeTicket = this.getTicketsStore();
        storeTicket.load({
            callback:function(){               
                storeCategories.load({
                    callback:function(){
                        for(var i=0;i<storeCategories.getCount();i++){
                            var count = 0;
                            for(var k=0;k<storeTicket.getCount();k++){                                
                                if(storeCategories.data.items[i].data.id === storeTicket.data.items[k].data.category.id){
                                    count++;
                                }
                            }
                            var object = new Helpdesk.model.TicketByCategory();
                            object.data.category = storeCategories.data.items[i].data.name;
                            object.data.ticketCount = count;
                            store.add(object);                            
                        }
                    }
                });        
            }
        }); 
        
    },
    
    /**
     * 
     * @param {type} form
     * @returns {undefined}
     * Sets the information of the users in the view
     */
    setView:function(form){
        var count = 0;
        var store = this.getUsersStore();
        store.load({
            callback:function(){                
                for(var i=0;i<store.getCount();i++){
                    if(store.data.items[i].data.userGroup.id === 1){
                        count++;
                    }
                }
                if(count===0 || count ===1){
                    form.down('#txtDescriptionPlan').setText('Utilizando '+count+" usuário");
                }else{
                    form.down('#txtDescriptionPlan').setText('Utilizando '+count+" usuários");
                }
            }
        });
    },
    
    /**
     * @author Ricardo
     * @returns {undefined}
     * 
     * Configura a store que alimenta o gráfico de tickets por pessoa
     *
     */
    setCharUsers:function(){
        //seta a view           
        
        var ticketsFromUserStore = this.getTicketsFromUserStore();
        ticketsFromUserStore.removeAll(true);        
        var ticketsStore = this.getTicketsStore();        
        var usersStore = this.getUsersStore().load({
            callback:function(){
                ticketsStore.load({
                    callback:function(){                        
                        for(var i=0;i<usersStore.getCount();i++){
                            var object = new Helpdesk.model.TicketsByUser();
                            object.data.user = usersStore.data.items[i].data.name;
                            var count = 0;                            
                            for(var k=0;k<ticketsStore.getCount();k++){                                
                                if(usersStore.data.items[i].data.id === ticketsStore.data.items[k].data.user.id){
                                    count++;                                    
                                }
                            }
                            object.data.ticketCount = count;
                            ticketsFromUserStore.add(object);                           
                        }                        
                    }
                });
            }
        });        
    },
    
    /**
     * 
     * @returns {undefined}
     * Sets the ticket's status chart
     */
    setChartTicketsStatus:function(){
        //seta a view
        //this.getDashboardView().getLayout().setActiveItem(Helpdesk.Globals.status_ticket);
        
        var opened = 0;
        var closed = 0;
        var noResponsible = 0;
        
        var store = this.getTicketsStatusStore();
        store.removeAll(true);
        
        var ticketsStore = this.getTicketsStore();        
        ticketsStore.load({
            /*params:{
                user: Helpdesk.Globals.user
            },*/
            callback:function(){
                for(var k=0;k<ticketsStore.getCount();k++){                    
                    if(ticketsStore.data.items[k].data.isOpen === true){
                        opened++;
                    }else if(ticketsStore.data.items[k].data.isOpen === false){
                        closed++;
                    }
                    if(ticketsStore.data.items[k].data.responsavel===null){
                        noResponsible++;
                    }
                }
                
                var modelOpen = new Helpdesk.model.TicketStatus();
                modelOpen.data.name = translations.OPENED;
                modelOpen.data.count = opened;
                store.add(modelOpen);               
                
                var modelNoResponsible = new Helpdesk.model.TicketStatus();
                modelNoResponsible.data.name = translations.NO_RESPONSIBLE;
                modelNoResponsible.data.count = noResponsible;
                store.add(modelNoResponsible);
                
                var modelClosed = new Helpdesk.model.TicketStatus();
                modelClosed.data.name = translations.CLOSED;
                modelClosed.data.count = closed;
                store.add(modelClosed);
                
                ticketsStore.proxy.url='ticket';                
            }
        });        
        
    },  
    
    backToDefaultStore: function(scope){
        scope.getTicketPanel().getStore().proxy.url = 'ticket';
    },
    
});