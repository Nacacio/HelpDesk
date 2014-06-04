/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.FormPanelUser', {
    extend: 'Ext.form.Panel',
    alias: 'widget.formpaneluser',
    border: 0,
    padding: 2,
    requires: [
        'Helpdesk.view.user.UserComboBox'],
    layout: {
        type: 'hbox'
    },
    listeners: {
        refresh: function() {
            this.setLoading(false);
        }
    },
    items: [
        {
            xtype: 'usercombobox',
            fieldLabel: '',
            width: 600,
            itemId: 'user'
        },
        {
            xtype: 'button',
            margin: '2 5 5 5',
            id: 'generateReport',
            height: 20,
            width: 100,
            text: translations.GENERATE_REPORT
        }
    ]
});

