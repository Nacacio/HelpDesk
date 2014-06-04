/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.ReportsByUser', {
    extend: 'Ext.container.Container',
    alias: 'widget.reportsbyuser',
    autoScroll: true,
    requires: [
        'Helpdesk.view.reports.GraphicUserPanel'], 
    items: [
        {
            xtype: 'graphicuserpanel'              
        }
    ]
});
