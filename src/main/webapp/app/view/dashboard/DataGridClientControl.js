Ext.define('Helpdesk.view.dashboard.DataGridClientControl' ,{
    extend:'Ext.grid.Panel',    
    alias:'widget.datagridclient',
    store: 'TicketsOngoingClient',
    columns: [
        { header: translations.CLIENT, dataIndex: 'user', flex:1 },
        { header: translations.ON_GOING, dataIndex: 'ticketCount'},       
    ]
});