Ext.define('Helpdesk.view.ticket.TicketGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.ticketgrid',
    store: 'Tickets',
    requires: ['Helpdesk.store.Tickets'],    
    border:0, 
    cls:'grid-style-header',
    
    constructor: function(config){
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
                width: 170,
                dataIndex: 'id',
                flex:0              
            },{
                header: translations.CLIENT,
                flex:1,
                dataIndex: 'clientName'
            },{
                header: translations.TITLE,
                flex:2,
                dataIndex: 'title'
            },{
                header: translations.CATEGORY,
                width: 170,
                flex:0,
                dataIndex: 'categoryName'
            },{
                header: translations.STATUS,
                width: 170,
                flex:0,
                dataIndex: 'isOpen',
                renderer: function(value, metaData, record) { // #2
                    return value ? translations.OPENED : translations.CLOSED;
                }
            },{
                header: translations.RESPONSIBLE,
                width: 170,
                flex:0,
                dataIndex: 'responsavelName'
            }
        ], 
        defaults: {
           tdCls: 'grid-style-row'
        }
    },
    dockedItems: [{
        xtype: 'pagingtoolbar',
        itemId:'dockedItem',
        store: 'Tickets',   
        dock: 'bottom',
        displayInfo: true,
        margin: '0 0 30 0',
        listeners: {
            afterrender : function() {
                this.child('#refresh').hide();
            }
        }

    }]
});

