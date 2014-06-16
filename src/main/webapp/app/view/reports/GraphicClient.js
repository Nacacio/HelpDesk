/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.GraphicClient', {
    extend: 'Ext.chart.Chart',
    style: 'background:#fff',
    alias: 'widget.graphicclient',
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
    listeners: {
        refresh: function() {
            this.setLoading(false);
        }
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
        }, 
        {
            id: 'axeCategory',
            type: 'Time',
            dateFormat: translations.DATE_FORMAT,
            minorTickSteps: 1,
            position: 'bottom',
            fields: ['date'],
            label   : {
             rotation:{degrees:290}
            }
        }
    ]
});