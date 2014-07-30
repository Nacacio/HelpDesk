/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.store.Priorities', {
    extend: 'Helpdesk.store.BasicStore',
    requires: ['Helpdesk.model.Priority'],
    model: 'Helpdesk.model.Priority',
    storeId: 'priorities',
    autoLoad: false,
    constructor: function(config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: Ext.create('Helpdesk.proxy.Base', {
                url: 'priority'
            })
        });
        this.callParent([config]);
    }
});

