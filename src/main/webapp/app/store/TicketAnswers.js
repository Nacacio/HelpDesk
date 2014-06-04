
Ext.define('Helpdesk.store.TicketAnswers', {
    extend: 'Helpdesk.store.BasicStore',
    requires: ['Helpdesk.model.TicketAnswer'],
    model: 'Helpdesk.model.TicketAnswer',
    storeId: 'tktAnswers',
    autoLoad: false,
    constructor: function(config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: Ext.create('Helpdesk.proxy.Base', {
                url: 'ticket-answer'
            })
        });
        this.callParent([config]);
    },
    
    onCreateRecords: function(records, operation, success) {
        if (success) {           
            Ext.Msg.alert(translations.INFORMATION, translations.TICKET_ANSWER_SAVED);
        }
    },

});

