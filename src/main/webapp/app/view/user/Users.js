/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('Helpdesk.view.user.Users', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.users',      
    layout: {
        type: 'fit'
    },
    requires: [
        'Helpdesk.view.user.UsersList'
    ],  
    border:0,
    items: [
        {
            xtype: 'userslist'
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
                    itemId: 'add',
                    iconCls: 'add_16'
                },
                {
                    xtype: 'button',
                    text: translations.EDIT,
                    itemId: 'edit',
                    iconCls: 'edit_16'
                },
                {
                    xtype: 'button',
                    text: translations.DELETE,
                    itemId: 'delete',
                    iconCls: 'delete_16'
                }

            ]

        }
    ]
});
