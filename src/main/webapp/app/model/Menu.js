/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.model.Menu', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'text'
        },
        {
            name: 'iconCls'
        },
        {
            name: 'className'
        },
        {
            name: 'id'
        },
        {
            name: 'menu'
        }
    ],
    hasMany: {
        model: 'Helpdesk.model.Menu',
        name: 'items'
    },
    belongsTo: {
        model: 'Helpdesk.model.Menu',
        associationKey: 'menu'
    }
});