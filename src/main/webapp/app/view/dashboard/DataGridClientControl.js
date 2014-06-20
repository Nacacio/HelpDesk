Ext.define('Helpdesk.view.dashboard.DataGridClientControl' ,{
    extend:'Ext.grid.Panel',    
    alias:'widget.datagridclient',
    store: 'TicketsOngoingClient',
    columns: [
        { header: translations.USER, dataIndex: 'user', flex:1 },
        { header: translations.IN_PROGRESS, dataIndex: 'ticketCount'}       
    ]
});