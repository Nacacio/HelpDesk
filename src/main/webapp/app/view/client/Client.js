/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('Helpdesk.view.client.Client', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.client',      
    layout: {
        type: 'fit'
    },
    requires: [
        'Helpdesk.view.client.ClientGrid'
    ],  
    border:0,
    items: [
        {
            xtype: 'clientgrid'
        }
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            flex: 1,
            dock: 'top',
            items: [
                {
                    xtype: 'button',
                    text: translations.ADD,
                    itemId: 'addClient',
                    iconCls: 'add_16'
                },
                {
                    xtype: 'button',
                    text: translations.DELETE,
                    itemId: 'deleteClient',
                    iconCls: 'delete_16'
                },
                {
                    xtype: 'tbfill'
                },
                {
                    xtype: 'button',
                    text: translations.SAVE,
                    itemId: 'saveClient',
                    iconCls: 'save_16'
                }

            ]

        }
    ]
});
