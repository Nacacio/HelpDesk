/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.model.Priority',{
   extend: 'Ext.data.Model',
   idProperty: 'id',
   fields: [
       {name: 'name',
           convert: function (newValue, model) {
               return translations[newValue];
           }
       }
   ]
});

