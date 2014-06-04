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
    pageSize: 10,
    start:0,
    limit: 10,
    pageSize:10,   
    autoLoad: false,    
    constructor: function(config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: Ext.create('Helpdesk.proxy.Base', {
                url: 'ticket'
            })
        });
        this.callParent([config]);
    }
});

