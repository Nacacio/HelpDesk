/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.GraphicUserPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.graphicuserpanel',
    border: 0,
    autoScroll: true,
    requires: ['Helpdesk.view.reports.GraphicUser',
        'Helpdesk.view.reports.FormPanelUser',
        'Helpdesk.view.reports.FormGraphicUser',
        'Helpdesk.view.reports.GridConsolidatedPerMonthUser',
        'Helpdesk.view.reports.FormConsolidatedPerMonthUser'],
    renderTo: Ext.getBody(),
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'label',
            padding: '9 5 5 5',
            text: translations.SELECT_A_USER
        },
        {
            id: 'formPanelUser',
            xtype: 'formpaneluser'
        },
        {
            xtype: 'label',
            cls: 'rounded_frame',
            text: translations.EVOLUTION_TICKETS_BY_USER,
            hidden: true
        },
        {
            xtype: 'panel',
            hidden: true,
            cls: 'rounded_frame',
            title: translations.EVOLUTION_TICKETS_BY_USER,
            id: 'panelEvolutionTicketsByUser',
            items: [
                {
                  xtype: 'formgraphicuser'  
                },
                {
                    renderTo: Ext.getBody(),
                    xtype: 'graphicuser'
                }
            ]
        },
        {
            xtype: 'panel',
            hidden: true,
            cls: 'rounded_frame',
            title: translations.CONSOLIDATED_PER_MONTH,
            id: 'panelConsolidatedPerMonthUser',
            height: 320,
            layout: {
                type: 'vbox'
            },
            items: [
                {
                    id: 'formConsolidatedPerMonthUser',
                    xtype: 'formconsolidatedpermonthuser'
                },
                {
                    xtype: 'container',
                    id: 'containerGridUser',
                    width: 785,
                    items: [
                        {
                            xtype: 'gridconsolidatedpermonthuser',
                            id: 'gridConsolidatedPerMonthUser',
                            region: 'center'
                        }
                    ]
                }
            ]
        }
    ]
});

