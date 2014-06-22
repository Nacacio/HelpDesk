/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.ticket.TicketAnswerPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.ticketanswerpanel',    
    collapsible:true,
    collapsed:true,
    hideCollapseTool:true,
    floatable:false,  
    cls:'panel-answer',    
   listeners: {
      afterrender: function(panel) {
        panel.header.el.on('click', function() {
            if (panel.collapsed) 
            {
                panel.expand();
                panel.el.setStyle('margin','0 0 10px 0');
            }
            else {
                panel.collapse();
                panel.el.setStyle('margin','0 0 0 0');
            }
        });
      }
    },
    items:[        
        {
            xtype: 'hiddenfield',
            itemId: 'id'
        },
        {
            xtype: 'hiddenfield',
            itemId: 'idAnswer'
        },
        {
            xtype: 'label',
            itemId: 'corpo'            
        },
        {
            xtype: 'container',
            itemId: 'anexo',  
            margin: '10 0 0 0',
            layout: {
                type: 'vbox'
            }
        }
    ]
});

