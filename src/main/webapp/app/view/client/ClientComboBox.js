/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.client.ClientComboBox',{
    extend: 'Ext.form.field.ComboBox',
    fieldLabel: translations.CLIENT,
    name: 'clientName',
    displayField: 'name',
    valueField: 'id',
    store: 'Clients',
    alias: 'widget.clientcombobox',
    listeners:{
        'afterrender': function(){
            this.store.load();
        }
    }
});
