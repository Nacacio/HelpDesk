Ext.define('Helpdesk.view.dashboard.DataGridAgentControl' ,{
    extend:'Ext.grid.Panel',    
    alias:'widget.datagridagent',
    store: 'TicketsOngoingAgent',
    columns: [
        { header: translations.AGENT,  dataIndex: 'user', flex:1 },
        { header: translations.ON_GOING, dataIndex: 'ticketCount'},
        
    ]
});