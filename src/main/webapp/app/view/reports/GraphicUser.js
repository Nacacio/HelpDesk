/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.GraphicUser', {
    extend: 'Ext.chart.Chart',
    style: 'background:#fff',
    alias: 'widget.graphicuser',
    renderTo: Ext.getBody(),
    requires: [
        'Ext.fx.target.Sprite',
        'Ext.layout.container.Fit',
        'Ext.window.MessageBox'
    ],
    stores: 'Reports',
    constructor: function(config) {
        this.param = config.param; // get your param value from the config object
        config.store = Ext.create('Helpdesk.store.Reports', {}); // Blank Configuration needs to be passed in order to trigger the constructor call of the class
        this.callParent(arguments);
    },
    height: 440,
    width: 770,
    animate: true,
    shadow: true,
    theme: 'Category1',
    legend: {
        position: 'right'
    },
    axes: [{
            id: 'axeNumeric',
            type: 'Numeric',
            minimum: 0,
            position: 'left',
            baseCls: 'font_size_graphic',
            title: translations.QUANTITY_OF_CREATED_TICKETS,
            minorTickSteps: 1,
            grid: true
        }, {
            id: 'axeCategory',
            type: 'Category',
            position: 'bottom',
            fields: ['date','valueOpen','valueClosed']
//            grid: true
        }],
    series: [{
            type: 'line',
            highlight: {
                size: 7,
                radius: 7
            },
            axis: 'left',
            title: translations.OPEN,
            xField: 'date',
            yField: 'valueOpen',
            markerCfg: {
                type: 'cross',
                size: 4,
                radius: 4,
                'stroke-width': 0
            }
        }, {
            type: 'line',
            highlight: {
                size: 7,
                radius: 7
            },
            axis: 'left',
            fill: true,
            title: translations.CLOSED,
            xField: 'date',
            yField: 'valueClosed',
            markerCfg: {
                type: 'circle',
                size: 4,
                radius: 4,
                'stroke-width': 0
            }
        }]
});