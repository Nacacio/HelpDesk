/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('Helpdesk.view.priority.Priority', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.priority',      
    layout: {
        type: 'fit'
    },
    requires: [
        'Helpdesk.view.priority.PriorityGrid'
    ],  
    border:0,
    items: [
        {
            xtype: 'prioritygrid'
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
                    itemId: 'addPriority',
                    iconCls: 'add_16'
                },
                {
                    xtype: 'button',
                    text: translations.DELETE,
                    itemId: 'deletePriority',
                    iconCls: 'delete_16'
                },
                {
                    xtype: 'tbfill'
                },
                {
                    xtype: 'button',
                    text: translations.SAVE,
                    itemId: 'savePriority',
                    iconCls: 'save_16'
                }

            ]

        }
    ]
});
