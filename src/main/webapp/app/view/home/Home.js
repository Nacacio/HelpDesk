/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.home.Home', {
    extend: 'Ext.container.Container',
    layout: 'fit',
    alias: 'widget.home',    
    requires: [
        'Helpdesk.view.Translation',
        'Helpdesk.view.dashboard.Dashboard'
    ],
    
    items:[
        {
            xtype:'dashboard'
        }
    ]
    
});
