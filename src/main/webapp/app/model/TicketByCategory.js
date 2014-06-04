Ext.define('Helpdesk.model.TicketByCategory', {
    extend: 'Ext.data.Model',
    //requires: ['Helpdesk.model.User'],
    idProperty: 'id',
    fields: [        
        {name: 'category', mapping: 'category.name',persist : false},
        {name: 'ticketCount'}
    ]
});