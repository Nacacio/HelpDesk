Ext.define('Helpdesk.model.TicketsByUser', {
    extend: 'Ext.data.Model',
    //requires: ['Helpdesk.model.User'],
    idProperty: 'id',
    fields: [        
        {name: 'user', mapping: 'user.name',persist : false},
        {name: 'ticketCount'}
    ]
});