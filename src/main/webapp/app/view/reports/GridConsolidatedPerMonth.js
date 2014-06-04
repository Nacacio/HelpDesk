/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.GridConsolidatedPerMonth', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridconsolidatedpermonth',
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
                id: 'name',
                width: 155,
                header: translations.CATEGORY,
                dataIndex: 'name'
            }, {
                width: 155,
                header: translations.OPEN,
                dataIndex: 'openFrom'
            }, {
                width: 155,
                header: translations.CREATED,
                dataIndex: 'created'
            }, {
                width: 155,
                header: translations.CLOSED,
                dataIndex: 'closed'
            }, {
                width: 155,
                header: translations.OPEN,
                dataIndex: 'openTo'
            }],
        defaults: {
            tdCls: 'grid-style-row'
        }
    }

});
