/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.model.ConsolidatedPerMonthContainer',{
   extend: 'Ext.data.Model',
   fields: [       
        {name: 'date'},
        {name: 'name'},
        {name: 'openFrom'},
        {name: 'openTo'},
        {name: 'created'},
        {name: 'closed'},
        {name: 'value'},
        {name: 'dateOpenFrom'},
        {name: 'dateOpenTo'}       
   ]
});

