/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.store.ChangesTicket', {
    extend: 'Helpdesk.store.BasicStore',
    requires: ['Helpdesk.model.ChangesTicket'],
    model: 'Helpdesk.model.ChangesTicket',    
    storeId: 'changesTickets',
    autoLoad: false,
    constructor: function(config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: Ext.create('Helpdesk.proxy.Base', {
                url: 'changes-ticket'
            })
        });
        this.callParent([config]);
    },
    findByTicket: function(callbackFunction, ticket) {
        this.load({
            url: 'changes-ticket/' + ticket,
            callback: callbackFunction
        });
    }
});

