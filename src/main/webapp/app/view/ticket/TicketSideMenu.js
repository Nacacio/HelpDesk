/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.ticket.TicketSideMenu', {
    extend: 'Ext.panel.Panel',
    layout: 'vbox',
    alias: 'widget.ticketsidemenu',
    bodyCls: 'default_background',
    padding: '10 0 10 0',
    border: 0,
    defaults: {
        toggleGroup: 'sidemenu-ticket',
        allowDepress: false,
        xtype: 'button',
        width: 180,
        baseCls: 'sidemenu-button', 
        hidden:true
    },
     items: [       
        {                    
            itemId:'buttonTodos'
        },
        {                    
            itemId:'buttonMeusTickets'
        },
        {                    
            itemId:'buttonSemResponsavel'
        },
        {                    
            itemId:'buttonEmAndamento',
            pressed: true
        },
        {                   
            itemId:'buttonFechado'
        },
        {
            xtype: 'tbfill'  
        }
    ]
});