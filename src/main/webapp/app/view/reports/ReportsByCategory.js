/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.ReportsByCategory', {
    extend: 'Ext.container.Container',
    alias: 'widget.reportsbycategory',
    autoScroll: true,
    requires: [
        'Helpdesk.view.reports.GraphicCategory', 
        'Helpdesk.view.reports.GraphicCategoryPanel'],    
    items: [
        {
            xtype: 'label',
            text: translations.REPORTS_BY_CATEGORY,
            cls: 'report-title'
        },
        {
            xtype: 'graphiccategorypanel'              
        }

    ]
});
