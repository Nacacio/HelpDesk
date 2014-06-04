/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.settings.Settings', {
    extend: 'Ext.container.Container',
    alias: 'widget.settings',
    layout: {
        type: 'border'
    },
    requires: [
        'Helpdesk.view.Translation',
        'Helpdesk.view.settings.SettingsSideMenu',
        'Helpdesk.view.user.Users',
        'Helpdesk.view.category.Category',
        'Helpdesk.view.client.Client',
        'Helpdesk.view.priority.Priority'
    ],
    items: [
        {
            xtype: 'settingssidemenu',
            itemId: 'settingssidemenu',
            region: 'west'
        },
        {
            xtype: 'container',
            region: 'center',
            layout: 'card',
            itemId: 'settingscardpanel',
            defaults: {
                padding:10,
                cls:'background-white-and-shadow' 
            },
            items:[
                {
                    xtype: 'users'
                },
                {
                    xtype: 'category'
                },
                {
                    xtype: 'client'
                },
                {
                    xtype: 'priority'
                }
            ]
        }
    ]
});
