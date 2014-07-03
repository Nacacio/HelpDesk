/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.priority.PriorityComboBox', {
    extend: 'Ext.form.field.ComboBox',
    fieldLabel: translations.PRIORITY,
    name: 'priorityName',
    displayField: 'name',
    valueField: 'id',
    store: 'Priorities',
    alias: 'widget.prioritycombobox',
    listeners:{
        'afterrender': function(){
            this.store.load();
        }
    }
});

