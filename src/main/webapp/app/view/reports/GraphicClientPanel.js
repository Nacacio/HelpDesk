/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.GraphicClientPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.graphicclientpanel',
    border: 0,
    autoScroll: true,
    requires: ['Helpdesk.view.reports.GraphicClient',
        'Helpdesk.view.reports.FormGraphicClient',
        'Helpdesk.view.reports.FormConsolidatedPerMonth',
        'Helpdesk.view.reports.GridConsolidatedPerMonthClient'],
    renderTo: Ext.getBody(),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'panel',
            cls: 'rounded_frame',
            title: translations.EVOLUTION_TICKETS_BY_CLIENT,
            id: 'panelEvolutionTicketsByClient',
            items: [
                {
                    id: 'formGraphicClient',
                    xtype: 'formgraphicclient'
                },
                {
                    renderTo: Ext.getBody(),
                    xtype: 'graphicclient'
                }
            ]
        },
        {
            xtype: 'panel',
            cls: 'rounded_frame',
            title: translations.CONSOLIDATED_PER_MONTH,
            id: 'panelConsolidatedPerMonthClient',
            layout: {
                type: 'vbox'
            },
            items: [
                {
                    xtype: 'formconsolidatedpermonth'
                },
                {
                    xtype: 'container',
                    id: 'containerGridClient',
                    width: 785,
                    items: [
                        {
                            xtype: 'gridconsolidatedpermonthclient',
                            id: 'gridConsolidatedPerMonthClient',
                            region: 'center'
                        }
                    ]
                }

            ]
        },
        {
            xtype: 'panel',
            cls: 'rounded_frame',
            id: 'panelHighLightCurrentClient',
            title: translations.HIGHLIGHT_CURRENT,
            layout: {
                type: 'vbox'
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'highlightcurrent_panel',
                    id: 'containerHighlightCurrentClient',
                    layout: {
                        type: 'vbox'
                    }
                }]
        }
    ]
});

