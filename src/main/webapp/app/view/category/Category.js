/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('Helpdesk.view.category.Category', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.category',      
    layout: {
        type: 'fit'
    },
    requires: [
        'Helpdesk.view.category.CategoryGrid'
    ], 
    border:0,
    items: [
        {
            xtype: 'categorygrid'
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
                    itemId: 'addCategory',
                    iconCls: 'add_16'
                },
                {
                    xtype: 'button',
                    text: translations.DELETE,
                    itemId: 'deleteCategory',
                    iconCls: 'delete_16'
                },
                {
                    xtype: 'tbfill'
                },
                {
                    xtype: 'button',
                    text: translations.SAVE,
                    itemId: 'saveCategory',
                    iconCls: 'save_16'
                }

            ]

        }
    ]
});
