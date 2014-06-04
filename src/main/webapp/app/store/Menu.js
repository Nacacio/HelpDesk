/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.store.Menu', {
    extend: 'Ext.data.Store',
    requires: [
        'Helpdesk.model.Menu'
    ],
    model: 'Helpdesk.model.Menu',
    autoLoad: false,
    constructor: function(config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: Ext.create('Helpdesk.proxy.Base', {
                url: 'menu'
            })
        });
        this.callParent([config]);
    },
    loadMenu: function(callbackFunction) {
        this.load(callbackFunction);
    }
});
