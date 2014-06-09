/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.model.Ticket',{
   extend: 'Ext.data.Model',
   idProperty: 'id',
   fields: [       
        {name: 'isOpen'},
        {name: 'startDate'},
        {name: 'endDate'},
        {name: 'estimateTime'},
        {name: 'description'},
        {name: 'title'},
        {name: 'stepsTicket'},
        {name: 'user'},     
        {name: 'responsavel'},
        {name: 'category'},
        {name: 'client'},
        {name: 'priority'},        
        {name: 'userName', mapping: 'user.name',persist: false},
        {name: 'clientName', mapping: 'client.name',persist: false},
        {name: 'userGroupName', mapping: 'user.userGroup.name',persist: false},        
        {name: 'responsavelName', mapping: 'responsavel.name',persist: false},
        {name: 'categoryName', mapping: 'category.name',persist: false},
        {name: 'priorityName', mapping: 'priority.name',persist: false}        
        
   ]
});

