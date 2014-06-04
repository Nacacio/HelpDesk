/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.GraphicCategoryPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.graphiccategorypanel',
    border: 0,
    autoScroll: true,
    requires: ['Helpdesk.view.reports.GraphicCategory',
        'Helpdesk.view.reports.FormGraphicCategory',
        'Helpdesk.view.reports.FormConsolidatedPerMonth',
        'Helpdesk.view.reports.GridConsolidatedPerMonth'],
    renderTo: Ext.getBody(),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'panel',
            cls: 'rounded_frame',
            title: translations.EVOLUTION_TICKETS_BY_CATEGORY,
            id: 'panelEvolutionTicketsByCategory',
            items: [
                {
                    id: 'formGraphicCategory',
                    xtype: 'formgraphiccategory'
                },
                {
                    renderTo: Ext.getBody(),
                    xtype: 'graphiccategory'
                }
            ]
        },
        {
            xtype: 'panel',
            cls: 'rounded_frame',
            title: translations.CONSOLIDATED_PER_MONTH,
            id: 'panelConsolidatedPerMonth',
            height: 320,
            layout: {
                type: 'vbox'
            },
            items: [
                {
                    id: 'formConsolidatedPerMonth',
                    xtype: 'formconsolidatedpermonth'
                },
                {
                    xtype: 'container',
                    id: 'containerGrid',
                    width: 785,
                    items: [
                        {
                            xtype: 'gridconsolidatedpermonth',
                            id: 'gridConsolidatedPerMonth',
                            region: 'center'
                        }
                    ]
                }

            ]
        },
        {
            xtype: 'panel',
            cls: 'rounded_frame',
            id: 'panelHightLitghtCurrent',
            title: translations.HIGHLIGHT_CURRENT,
            height: 250,
            layout: {
                type: 'vbox'
            },
            items: [
                {
                    xtype: 'container',
                    id: 'containerHightligthCurrent',
                    layout: {
                        type: 'vbox'
                    }

                }]
        }
    ]
});

