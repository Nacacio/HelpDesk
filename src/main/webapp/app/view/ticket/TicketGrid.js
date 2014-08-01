Ext.define('Helpdesk.view.ticket.TicketGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ticketgrid',
    store: 'Tickets',
    requires: ['Helpdesk.store.Tickets'],
    border: 0,
    cls: 'grid-style-header',
    scope: this,
    constructor: function(config) {
        this.param = config.param; // get your param value from the config object
        config.store = Ext.create('Helpdesk.store.Tickets', {
            pageSize: Helpdesk.Globals.pageSizeGrid,
            reader: {
                root: 'items',
                totalProperty: 'total'
            }
        });
        this.callParent(arguments);
    },
    viewConfig: {
        stripeRows: false
    },
    columns: {
        items: [
            {
                header: translations.ID,
                width: 80,
                dataIndex: 'id',
                flex: 0,
                renderer: function(value, metaData, record) { // #2
                    var userLastInteration = record.get('userLastInteration').id;
                    var userLogged = Helpdesk.Globals.userLogged.id;
                    if (parseInt(userLastInteration) === parseInt(userLogged)) {
                        return value;
                    } else {
                        return '<b>' + value + '</b>';
                    }
                }
            }, {
                header: translations.CLIENT,
                flex: 1,
                dataIndex: 'clientName',
                renderer: function(value, metaData, record) { // #2
                    var userLastInteration = record.get('userLastInteration').id;
                    var userLogged = Helpdesk.Globals.userLogged.id;
                    if (parseInt(userLastInteration) === parseInt(userLogged)) {
                        return value;
                    } else {
                        return '<b>' + value + '</b>';
                    }
                }
            }, {
                header: translations.USER,
                flex: 1,
                width: 170,
                dataIndex: 'userName',
                renderer: function(value, metaData, record) { // #2
                    var userLastInteration = record.get('userLastInteration').id;
                    var userLogged = Helpdesk.Globals.userLogged.id;
                    if (parseInt(userLastInteration) === parseInt(userLogged)) {
                        return value;
                    } else {
                        return '<b>' + value + '</b>';
                    }
                }
            }, {
                header: translations.TITLE,
                flex: 2,
                dataIndex: 'title',
                renderer: function(value, metaData, record) { // #2
                    var userLastInteration = record.get('userLastInteration').id;
                    var userLogged = Helpdesk.Globals.userLogged.id;
                    if (parseInt(userLastInteration) === parseInt(userLogged)) {
                        return value;
                    } else {
                        return '<b>' + value + '</b>';
                    }
                }
            }, {
                header: translations.CATEGORY,
                width: 170,
                flex: 0,
                dataIndex: 'categoryName',
                renderer: function(value, metaData, record) { // #2
                    var userLastInteration = record.get('userLastInteration').id;
                    var userLogged = Helpdesk.Globals.userLogged.id;
                    if (parseInt(userLastInteration) === parseInt(userLogged)) {
                        return value;
                    } else {
                        return '<b>' + value + '</b>';
                    }
                }
            }, {
                header: translations.SITUATION,
                width: 140,
                flex: 0,
                dataIndex: 'isOpen',
                renderer: function(value, metaData, record) { // #2
                    var userLastInteration = record.get('userLastInteration').id;
                    var userLogged = Helpdesk.Globals.userLogged.id;
                    if (parseInt(userLastInteration) === parseInt(userLogged)) {
                        return value ? translations.OPENED : translations.CLOSED;
                    } else {
                        return value ? '<b>' + translations.OPENED + '</b>' : '<b>' + translations.CLOSED + '</b>';
                    }
                }
            }, {
                header: translations.LAST_INTERATION,
                width: 170,
                flex: 0,
                dataIndex: 'lastInteration',
                renderer: function(value, metaData, record) { // #2
                    var userLastInteration = record.get('userLastInteration').id;
                    var userLogged = Helpdesk.Globals.userLogged.id;
                    var lastInteration = new Date(value);
                    lastInteration = Ext.Date.format(lastInteration, translations.FORMAT_JUST_DATE);
                    if (parseInt(userLastInteration) === parseInt(userLogged)) {
                        return lastInteration;
                    } else {
                        return '<b>' + lastInteration + '</b>';
                    }
                }
            }, {
                header: translations.RESPONSIBLE,
                width: 170,
                flex: 0,
                dataIndex: 'responsibleName',
                renderer: function(value, metaData, record) { // #2
                    if (value !== null) {
                        var userLastInteration = record.get('userLastInteration').id;
                        var userLogged = Helpdesk.Globals.userLogged.id;
                        if (parseInt(userLastInteration) === parseInt(userLogged)) {
                            return value;
                        } else {
                            return '<b>' + value + '</b>';
                        }
                    }
                    return '';
                }
            }
        ],
        defaults: {
            tdCls: 'grid-style-row'
        }
    },
    dockedItems: [{
            xtype: 'pagingtoolbar',
            itemId: 'dockedItem',
            store: 'Tickets',
            dock: 'bottom',
            displayInfo: true,
            margin: '0 0 30 0',
            listeners: {
                afterrender: function() {
                    this.child('#refresh').hide();
                }
            }

        }]
});

