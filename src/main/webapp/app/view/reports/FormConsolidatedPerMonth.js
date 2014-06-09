/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.FormConsolidatedPerMonth', {
    extend: 'Ext.form.Panel',
    alias: 'widget.formconsolidatedpermonth',
    border: 0,
    padding: 2,
    layout: {
        type: 'hbox'
    },
    items: [
        {
            padding: '5 5 5 5',
            xtype: 'combobox',
            width: 300,
            valueField: 'name',
            displayField: 'value',
            queryMode: 'local'
        },
        {
            xtype: 'button',
            margin: 6,
            height: 20,
            text: translations.SEE
        }
    ]
});

