/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.store.UsersAdmin', {
    extend: 'Ext.data.Store',
    model: 'Helpdesk.model.User',
    autoLoad: false,
    requires: [
        'Helpdesk.model.User'
    ],
    
    constructor: function(config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: Ext.create('Helpdesk.proxy.Base', {
                url: 'user/admin'
            })
        });
        this.callParent([config]);
    }
});

