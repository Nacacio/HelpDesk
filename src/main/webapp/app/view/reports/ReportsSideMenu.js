/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.ReportsSideMenu', {
    extend: 'Ext.panel.Panel',
    layout: 'vbox',
    alias: 'widget.reportssidemenu',
    bodyCls: 'default_background',
    padding: '10 0 10 0',
    border: 0,
    defaults: {
        toggleGroup: 'sidemenu-reports',
        allowDepress: false,
        xtype: 'button',
        width: 180,
        baseCls: 'sidemenu-button'
    },
     items: [       
        {       
            itemId:'buttonTicketsByCategory',
            text: translations.TICKETS_BY_CATEGORY,
            pressed: true
        },
        {                    
            itemId:'buttonTicketsByUser',
            text: translations.TICKETS_BY_USER
        },
        {                    
            itemId:'buttonTicketsByClient',
            text: translations.TICKETS_BY_CLIENT
        }
//        ,{                    
//            itemId:'buttonExportData',
//            text: translations.EXPORT_DATA
//        }
    ]
});