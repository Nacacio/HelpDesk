Ext.define('Helpdesk.store.TicketsOngoingClient', {
    extend: 'Ext.data.Store',
    model: 'Helpdesk.model.TicketsByUser',
    requires: [
        'Helpdesk.model.TicketsByUser'
    ],
    autoLoad: false,
    constructor: function(config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: Ext.create('Helpdesk.proxy.Base', {
                url: 'ticketsongoingclient'
            })
        });
        this.callParent([config]);
    }    
});

