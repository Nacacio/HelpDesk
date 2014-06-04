/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.user.UserComboBox', {
    extend: 'Ext.form.field.ComboBox',
    fieldLabel: translations.USERS,
    name: 'userName',
    displayField: 'name',
    valueField: 'id',
    store: 'Users',
    alias: 'widget.usercombobox'
});

