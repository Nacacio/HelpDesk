/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    alias: 'widget.mainviewport',
    requires: [
        'Helpdesk.view.home.MainHeader', 'Helpdesk.view.Translation', 'Helpdesk.view.home.Home', 'Helpdesk.view.ticket.Ticket',
        'Helpdesk.view.settings.Settings', 'Helpdesk.view.server.ServerError', 'Helpdesk.view.perfil.Perfil','Helpdesk.view.priority.Priority',
        'Helpdesk.view.reports.Reports'
    ],
    items: [
        {
            xtype: 'mainheader'
        },
        {
            xtype: 'container',
            layout: 'card',
            itemId: 'maincardpanel',
            flex: 1,
            items: [
                {
                    xtype: 'servererror'
                },
                {
                    xtype: 'home'
                },
                {
                    xtype: 'ticket'
                },
                {
                    xtype: 'settings'
                },
                {
                    xtype:'perfil'
                },
                {
                    xtype: 'reports'
                }
            ]
        }
    ]
    
});