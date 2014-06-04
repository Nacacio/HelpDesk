/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.proxy.AssociationWriter', {
    extend: 'Ext.data.writer.Json',
    alias: 'writer.associationwriter',
 
    constructor: function(config) {
        this.callParent(arguments);
    },
 
    getRecordData: function (record, operation) {
        record.data = this.callParent(arguments);
        Ext.apply(record.data, record.getAssociatedData());
        return record.data;
    }
});