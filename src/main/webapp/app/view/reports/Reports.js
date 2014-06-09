/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.Reports', {
    extend: 'Ext.container.Container',
    alias: 'widget.reports',
    requires: [
        'Helpdesk.view.Translation',
        'Helpdesk.view.reports.ReportsByCategory',
        'Helpdesk.view.reports.ReportsByUser',
        'Helpdesk.view.reports.ReportsByClient',
        'Helpdesk.view.reports.ReportsExportData',
        'Helpdesk.view.reports.ReportsSideMenu'
    ],
    flex: 1,
    layout: {
        type: 'border'
    },
    itemId: 'reportsView',
    items: [
        {
            xtype: 'reportssidemenu',
            width: 180,
            region: 'west'
        },
        {
            xtype: 'container',
            region: 'center',
            layout: 'card',
            itemId: 'reportscardpanel',
            defaults: {
                padding: '20 0 50 10',
                cls: 'background-white-and-shadow'
            },
            items: [
                {
                    xtype: 'reportsbycategory'
                },
                {
                    xtype: 'reportsbyuser'
                },
                {
                    xtype: 'reportsbyclient'
                },
                {
                    xtype: 'reportsexportdata'
                }
            ]
        }]
});
