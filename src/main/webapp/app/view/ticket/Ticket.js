/* 
* To change this license header, choose License Headers in Project Properties.
* To change this template file, choose Tools | Templates
* and open the template in the editor.
*/
Ext.define('Helpdesk.view.ticket.Ticket', {
   extend: 'Ext.container.Container',
   alias: 'widget.ticket',
   requires: [
       'Helpdesk.view.Translation',
       'Helpdesk.view.ticket.TicketSideMenu',
       'Helpdesk.view.ticket.TicketGrid',
       'Helpdesk.view.ticket.NewTicket',
       'Helpdesk.view.ticket.TicketDetails',
       'Helpdesk.view.ticket.EditTicket'
   ],
   flex: 1,
   layout: {
       type: 'border'
   },    
   itemId: 'ticketView',
   items: [{
           xtype: 'ticketsidemenu',
           width: 180,
           region: 'west'
       },
       {
           xtype: 'container',
           itemId: 'cardContainer',
           region: 'center',            
           cls:'background-white-and-shadow',
           border: 0,
           layout: 'card',
           padding: '50 20 50 20',
           items:[{
                   xtype: 'container',
                   itemId:'maincontainer',
                   //layout:'border',
                   height: "100%",
                   cls: 'background-white',
                   items:[
                       {
                           xtype:'panel',
                           baseCls:'bordless',                            
                           layout:{
                               type:'hbox'
                           },
                           items:[
                               {                                               
                                   xtype: 'button',
                                   itemId: 'btnNewTicket',
                                   text: translations.CREATE_TICKET,
                                   height: 60,
                                   width: 265,
                                   iconCls: 'plus_icon_24',
                                   cls:'btn_new_ticket',
                                   region:'north'    
                               },
                               {
                                   xtype:'tbfill'
                               },
                               {
                                 xtype:'text',
                                 baseCls:'bold-words-size15',
                                 text:'Busca ',
                                 padding:'40 10 0 0'
                               },
                               {
                                   xtype:'combobox',
                                   itemId:'cmbSearch',
                                   text:translations.SEARCH,
                                   hideTrigger:true,
                                   width:200,
                                   padding:'40 0 0 0'
                               } 
                           ]
                       }                        
                       ,{
                           xtype: 'ticketgrid',
                           itemId: 'ticketgrid',
                           region:'center'                
                       }
                   ]
               },
               {
                   xtype: 'newticket'
               },
               {
                   xtype:'ticketdetails'                    
               }
           ]
       }],
});