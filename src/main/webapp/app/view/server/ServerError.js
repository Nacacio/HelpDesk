/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.server.ServerError',{
    extend: 'Ext.container.Container',
    layout:{
        type: 'border'
    },
    alias: 'widget.servererror',
    autoScroll: true,
    items:[
        {
            xtype:'button',
            text: translations.CLICK_TO_REPORT_ERROR,
            region: 'north'
        },
        {
            xtype: 'container',
            region: 'center',
            itemId: 'errorPanel'
        }
    ]
});
