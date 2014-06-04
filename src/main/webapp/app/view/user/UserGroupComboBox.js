/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.user.UserGroupComboBox', {
    extend: 'Ext.form.field.ComboBox',
    fieldLabel: translations.GROUP,
    name: 'userGroupName',
    displayField: 'name',
    valueField: 'id',
    store: 'UserGroups',
    alias: 'widget.usergroupcombobox'
});

