/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.store.Tickets', {
    extend: 'Helpdesk.store.BasicStore',
    requires: ['Helpdesk.model.Ticket'],
    model: 'Helpdesk.model.Ticket',
    storeId: 'tickets',
    autoLoad: false,
    pageSize: Helpdesk.Globals.pageSizeGrid,
    constructor: function(config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: Ext.create('Helpdesk.proxy.Base', {
                url: 'ticket',
                extraParams:{
                    user:  Helpdesk.Globals.user
                }
            })
        });
        this.callParent([config]);
    },
    onCreateRecords: function(records, operation, success) {
        if (success) {           
            Ext.Msg.alert(translations.INFORMATION, translations.TICKET+' '+translations.SAVED_WITH_SUCCESS);
        }
    },
    onUpdateRecords: function(records, operation, success) {
        if (success) {
            Ext.Msg.alert(translations.INFORMATION, translations.TICKET+' '+translations.UPDATED_WITH_SUCCESS);
        }
    },
    onDestroyRecords: function(records, operation, success){
        if(success){
            Ext.Msg.alert(translations.INFORMATION, translations.TICKET+' '+translations.DELETED_WITH_SUCCESS);
            this.callParent(arguments);
        }
    }
});

