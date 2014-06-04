/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.GridConsolidatedPerMonthUser', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridconsolidatedpermonthuser',
    border: 0,
    padding: 5,
    cls: 'grid-style-header',
    viewConfig: {
        stripeRows: false
    },
        listeners: {
        refresh: function() {
            this.setLoading(false);
        }
    },
    columns: {
        items: [
            {
                id: 'status',
                width: 620,
                header: translations.STATUS,
                dataIndex: 'name'
            }, {
                width: 155,
                header: translations.TICKETS,
                dataIndex: 'value'
            }],
        defaults: {
            tdCls: 'grid-style-row'
        }
    }

});
