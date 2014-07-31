Ext.define('Helpdesk.controller.Dashboard', {
    requires: [
        'Helpdesk.store.Users',
        'Helpdesk.store.Tickets',
        'Helpdesk.store.TicketsFromUser',
        'Helpdesk.store.TicketsStatus',
        'Helpdesk.store.Categories',
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
        'Categories',
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
            'tableticket button': {
                click: this.changeView
            }
        });
    },
    refs: [
        {
            ref: 'tableTicket',
            selector: 'dashboard'
        },
        {
            ref: 'ticketSide',
            selector: 'ticket > ticketsidemenu'
        },
        {
            ref: 'ticketPanel',
            selector: 'ticket #ticketgrid'
        }
    ],
    /**
     * 
     * @param {type} form
     * @returns {undefined}
     * Change the view according the selected button on the dashboard
     */
    changeView: function(button) {
        Ext.Router.redirect('ticket');
        this.removeSelection();
        if (button.itemId === 'btnDashboardNoResp') {
            this.getTicketsWithoutResponsible();
        } else if (button.itemId === 'btnDashboardLate') {
            this.getTicketsOpened();
        }
    },
    removeSelection: function() {
        this.getTicketSide().down('button#buttonWithoutResponsible').toggle(false);
        this.getTicketSide().down('button#buttonMyTickets').toggle(false);
        this.getTicketSide().down('button#buttonOpened').toggle(false);
        this.getTicketSide().down('button#buttonClosed').toggle(false);
        this.getTicketSide().down('button#buttonAll').toggle(false);
    },
    getTicketsWithoutResponsible: function() {
        var myscope = this;

        myscope.getTicketPanel().getStore().proxy.url = 'ticket/withoutresponsible-paging';
        myscope.getTicketSide().down('button#buttonWithoutResponsible').toggle(true);
        myscope.getTicketPanel().getStore().load({
            params: {
                user: Helpdesk.Globals.userLogged.userName,
                start: 0,
                limit: Helpdesk.Globals.pageSizeGrid
            },
            callback: function() {                
                myscope.backToDefaultStore(myscope);
                
                //loadStore to toolbar
                var toolbar = myscope.getTicketPanel().getDockedItems()[1];
                toolbar.getStore().proxy.url = 'ticket/withoutresponsible';;
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
    getTicketsOpened: function() {
        var myscope = this;

        myscope.getTicketPanel().getStore().proxy.url = 'ticket/opened-paging';
        myscope.getTicketSide().down('button#buttonOpened').toggle(true);
        myscope.getTicketPanel().getStore().load({
            params: {
                user: Helpdesk.Globals.userLogged.userName,
                start: 0,
                limit: Helpdesk.Globals.pageSizeGrid
            },
            callback: function() {                
                myscope.backToDefaultStore(myscope);
                
                //loadStore to toolbar
                var toolbar = myscope.getTicketPanel().getDockedItems()[1];
                toolbar.getStore().proxy.url = 'ticket/opened';
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
    getAllTickets: function() {
        var myscope = this;

        myscope.getTicketPanel().getStore().proxy.url = 'ticket/all';
        myscope.getTicketPanel().getStore().load({
            params: {
                user: Helpdesk.Globals.userLogged.userName
            },
            callback: function() {
                myscope.getTicketSide().down('button#buttonAll').toggle(true);
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
    setChartsAndView: function(form) {
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
    setInformationTable: function() {        
        var countResp = 0;
        var countOnGoing = 0;
        var form = this.getTableTicket().down('tableticket');
        var scope = this;
        var store = this.getTicketsStore();        
        store.load({
            callback: function() {
                for (var i = 0; i < store.getCount(); i++) {  
                    if (store.data.items[i].data.responsible === null && store.data.items[i].data.isOpen) {
                        countResp++;
                    }
                    if(store.data.items[i].data.isOpen){                       
                        countOnGoing++;                                                                   
                    }
                }                
                if (countResp === 0) {
                    form.down('panel#noRespHtml').update('0');
                } else {
                    form.down('panel#noRespHtml').update(countResp);
                }
                
                if (countOnGoing === 0) {
                    form.down('panel#noRespLate').update('0');
                } else {
                    form.down('panel#noRespLate').update(countOnGoing);
                }
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
    setDataGridsTable: function(ticketsStore) {
        var userStore = this.getUsersStore();        
        var scope = this;
        userStore.load({
            callback: function() {
                scope.getTableTicket().down('datagridagent').getStore().removeAll();
                scope.getTableTicket().down('datagridclient').getStore().removeAll();
                var userTemp;
                var ticketTemp;
                for (var i = 0; i < userStore.getCount(); i++) {
                    var countAgent = 0;
                    var countClient = 0;
                    userTemp = userStore.data.items[i].data;
                    for (var k = 0; k < ticketsStore.getCount(); k++) {
                        ticketTemp = ticketsStore.data.items[k].data;
                        if (ticketTemp.isOpen === true) {
                            if (userTemp.userGroup.id == Helpdesk.Globals.idAdminGroup) {
                                if (ticketTemp.responsible !== null && ticketTemp.responsible.id === userTemp.id) {
                                    countAgent++;
                                }
                            } else {
                                if (ticketTemp.user.id === userTemp.id) {
                                    countClient++;
                                }
                            }
                        }
                    }
                    var object = new Helpdesk.model.TicketsByUser();
                    object.data.user = userTemp.name;
                    if (userTemp.userGroup.id == Helpdesk.Globals.idAdminGroup) {
                        object.data.ticketCount = countAgent;
                        scope.getTableTicket().down('datagridagent').getStore().add(object);
                    }
                    else if (countClient > 0) {
                        object.data.ticketCount = countClient;
                        scope.getTableTicket().down('datagridclient').getStore().add(object);
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
    setChartCategory: function() {

        var store = this.getTicketsByCategoryStore();
        store.removeAll(true);
        var storeCategories = this.getCategoriesStore();
        var storeTicket = this.getTicketsStore();
        storeTicket.load({
            callback: function() {
                storeCategories.load({
                    callback: function() {
                        for (var i = 0; i < storeCategories.getCount(); i++) {
                            var count = 0;
                            for (var k = 0; k < storeTicket.getCount(); k++) {
                                if (storeCategories.data.items[i].data.id === storeTicket.data.items[k].data.category.id) {
                                    count++;
                                }
                            }
                            var object = new Helpdesk.model.TicketByCategory();
                            object.data.category = storeCategories.data.items[i].data.name;
                            object.data.ticketCount = count;
                            if (storeCategories.data.items[i].data.name !== 'NO_CATEGORY') {
                                store.add(object);
                            }
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
    setView: function(form) {
        var count = 0;
        var store = this.getUsersStore();
        store.load({
            callback: function() {
                for (var i = 0; i < store.getCount(); i++) {
                    if (store.data.items[i].data.userGroup.id == Helpdesk.Globals.idAdminGroup) {
                        count++;
                    }
                }
//                if (count === 0 || count === 1) {
//                    form.down('#txtDescriptionPlan').setText('Utilizando ' + count + " usuário");
//                } else {
//                    form.down('#txtDescriptionPlan').setText('Utilizando ' + count + " usuários");
//                }
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
    setCharUsers: function() {
        //seta a view           

        var ticketsFromUserStore = this.getTicketsFromUserStore();
        ticketsFromUserStore.removeAll(true);
        var ticketsStore = this.getTicketsStore();
        var usersStore = this.getUsersStore().load({
            callback: function() {
                ticketsStore.load({
                    callback: function() {
                        for (var i = 0; i < usersStore.getCount(); i++) {
                            var object = new Helpdesk.model.TicketsByUser();
                            object.data.user = usersStore.data.items[i].data.name;
                            var count = 0;
                            for (var k = 0; k < ticketsStore.getCount(); k++) {
                                if (usersStore.data.items[i].data.id === ticketsStore.data.items[k].data.user.id) {
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
    setChartTicketsStatus: function() {
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
             user: Helpdesk.Globals.userLogged.userName
             },*/
            callback: function() {
                for (var k = 0; k < ticketsStore.getCount(); k++) {
                    if (ticketsStore.data.items[k].data.isOpen === true) {
                        opened++;
                    } else if (ticketsStore.data.items[k].data.isOpen === false) {
                        closed++;
                    }
                    if (ticketsStore.data.items[k].data.responsible === null) {
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

                ticketsStore.proxy.url = 'ticket';
            }
        });
    },
    backToDefaultStore: function(scope) {
        scope.getTicketPanel().getStore().proxy.url = 'ticket';
    }
});
