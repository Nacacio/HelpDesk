/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.user.UserAdminComboBox', {
    extend: 'Ext.form.field.ComboBox',
    fieldLabel: translations.GROUP,
    name: 'adminName',
    displayField: 'name',
    valueField: 'id',
    store: 'UsersAdmin',
    alias: 'widget.responsiblescombobox',
    listeners:{
        'afterrender': function(){
            this.store.load();
        }
    }
});

