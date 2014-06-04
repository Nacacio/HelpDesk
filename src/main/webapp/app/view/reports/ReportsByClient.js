/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.ReportsByClient', {
    extend: 'Ext.container.Container',
    alias: 'widget.reportsbyclient',
        autoScroll: true,
    requires: ['Helpdesk.view.reports.GraphicClientPanel'],
    items: [
        {
            xtype: 'label',
            text: translations.REPORTS_BY_CLIENT,
            cls: 'report-title'
        },
        {
            xtype: 'graphicclientpanel'
        }
    ]
});
