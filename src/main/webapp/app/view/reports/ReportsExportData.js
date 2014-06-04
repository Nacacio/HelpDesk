/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.ReportsExportData', {
    extend: 'Ext.container.Container',
    alias: 'widget.reportsexportdata',
    items: [
         {
            xtype: 'label',
            text: translations.REPORTS_EXPORT_DATA,
            cls: 'title-new'            
        }
    ]
});
