Ext.define('Helpdesk.model.TicketAnswer', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [          
        {name: 'ticket'},
        {name: 'ticketId'}, 
        {name: 'user'},
        {name: 'userId'},   
        {name: 'description'} 
    ]
});