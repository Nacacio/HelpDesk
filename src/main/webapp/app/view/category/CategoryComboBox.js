/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.category.CategoryComboBox', {
    extend: 'Ext.form.field.ComboBox',
    fieldLabel: translations.CATEGORY,
    name: 'name',
    displayField: 'name',
    valueField: 'id',
    store: 'Categorys',
    alias: 'widget.categorycombobox',
    listeners:{
        'afterrender': function(){
            this.store.load();
        }
    }
});

