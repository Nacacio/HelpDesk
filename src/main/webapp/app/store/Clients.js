/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.store.Clients', {
    extend: 'Helpdesk.store.BasicStore',
    requires: ['Helpdesk.model.Client'],
    model: 'Helpdesk.model.Client',
    storeId: 'clients',
    autoLoad: false,
    constructor: function(config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: Ext.create('Helpdesk.proxy.Base', {
                url: 'client'
            })
        });
        this.callParent([config]);
    }

});

