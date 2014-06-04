/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.store.Users', {
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
                url: 'user'
            })
        });
        this.callParent([config]);
    },
    onCreateRecords: function(records, operation, success) {
        if (success) {           
            Ext.Msg.alert(translations.INFORMATION, translations.USER+' '+translations.SAVED_WITH_SUCCESS);
        }
    },
    onUpdateRecords: function(records, operation, success) {
        if (success) {
            Ext.Msg.alert(translations.INFORMATION, translations.USER+' '+translations.UPDATED_WITH_SUCCESS);
        }
    },
    onDestroyRecords: function(records, operation, success){
        if(success){
            Ext.Msg.alert(translations.INFORMATION, translations.USER+' '+translations.DELETED_WITH_SUCCESS);
            this.callParent(arguments);
        }
    },
    findByUserName: function(callbackFunction, username) {
        this.load({
            url: 'user/' + username,
            callback: callbackFunction
        });
    },
    findAll: function(callbackFunction) {
        this.load(callbackFunction);
    }
});

