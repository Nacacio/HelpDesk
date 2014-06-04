Ext.define('Helpdesk.view.dashboard.DashboardUsersChart', {
    alias:'widget.dashboardusers',
    extend:'Ext.chart.Chart',
    style: 'background:#fff',
    animate: true,
    shadow: true,
    store: 'TicketsFromUser',
    axes: [{
            type: 'Numeric',
            position: 'left',
            fields: ['ticketCount'],
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            },
            title: translations.NUMBER_OF_TICKETS,
            grid: true,
            minimum: 0
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['user'],
            title: translations.USERS,
        }],
    series: [{
            type: 'column',
            axis: 'left',
            highlight: true,
            tips: {
                trackMouse: true,
                width: 200,
                height: 28,
                renderer: function(storeItem, item) {
                    if(storeItem.get('ticketCount')>1){
                        this.setTitle(storeItem.get('user') + ': ' + storeItem.get('ticketCount') + ' Tickets'); 
                    }else{
                        this.setTitle(storeItem.get('user') + ': ' + storeItem.get('ticketCount') + ' Ticket');
                    }
                                       
                }
            },
            label: {
                display: 'insideEnd',
                'text-anchor': 'middle',
                field: 'id',
                renderer: Ext.util.Format.numberRenderer('0'),
                orientation: 'vertical',
                color: '#333'
            },
            xField: 'user',
            yField: 'ticketCount',
            renderer: function(sprite, record, attr, index, store){
                return Ext.apply(attr, {
                    fill: '#1e62d0'
                });
            }
        }]
});
