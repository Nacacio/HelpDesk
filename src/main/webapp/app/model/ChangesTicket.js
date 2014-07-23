/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.model.ChangesTicket', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [       
        {name: 'user'},
        {name: 'dateCreation'},
        {name: 'ticket'},
        {name: 'olderResponsible'},
        {name: 'newResponsible'},
        {name: 'olderCategory'},
        {name: 'newCategory'},
        {name: 'olderPriority'},
        {name: 'newPriority'},
        {name: 'olderEstimatedTime'},
        {name: 'newEstimatedTime'},
        {name: 'olderStateTicket'},
        {name: 'newStateTicket'},
        {name: 'ticketAnswer'},
        {name: 'userName', mapping: 'user.name', persist: false},        
        {name: 'olderResponsibleName', mapping: 'olderResponsible.name', persist: false},
        {name: 'newResponsibleName', mapping: 'newResponsible.name', persist: false},
        {name: 'olderCategoryName', mapping: 'olderCategory.name', persist: false},
        {name: 'newCategoryName', mapping: 'newCategory.name', persist: false},
        {name: 'olderPriorityName', mapping: 'olderPriority.name', persist: false},
        {name: 'newPriorityName', mapping: 'newPriority.name', persist: false}
    ]
});

