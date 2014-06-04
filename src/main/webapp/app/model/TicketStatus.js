Ext.define('Helpdesk.model.TicketStatus',{
   extend: 'Ext.data.Model',
   idProperty: 'id',
   fields: [
       {name: 'name'},
       {name: 'count'},       
   ]
});