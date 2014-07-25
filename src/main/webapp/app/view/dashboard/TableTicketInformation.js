Ext.define('Helpdesk.view.dashboard.TableTicketInformation', {
    extend:'Ext.panel.Panel',
    alias:'widget.tableticket',     
    height: 120,
    baseCls:'bordless',
    padding:'0 10 0 10',
    layout: {
        type: 'table',
        // The total column count must be specified here
        columns: 3
    },
    defaults: {        
        baseCls:'bordless',
        height:30, 
        width:210,
        padding:'8 0 0 0'
    },
    viewConfig: {
        stripeRows: false
    },
    items: [
        
        //No Responsible Tickets
        {
            html: translations.NO_RESPONSIBLE+': ',
            padding:'30 0 0 0'
        },
        {
            xtype:'panel',
            itemId:'noRespHtml',
            padding:'30 0 0 0'
        },
        {
            xtype:'panel',
            padding:'30 0 0 0',
            items:[
                {
                    xtype:'button',
                    text:translations.SEE_TICKETS_WITHOUT_RESPONSIBLE,
                    baseCls:'dashbord-links-buttons',
                    itemId:'btnDashboardNoResp',
                    width:235,
                    padding:'20 0 0 0'
                }
            ]
        },
        
        // Tickets late
        {
            html: translations.ON_GOING+': ',
            padding:'30 0 0 0'
        },
        {
            xtype:'panel',
            itemId:'noRespLate',
            padding:'30 0 0 0'
        },
        {
            xtype:'panel',
            padding:'30 0 0 0',
            items:[
                {
                    xtype:'button',
                    text:translations.SEE_TICKETS_ON_GOING,
                    baseCls:'dashbord-links-buttons',
                    itemId:'btnDashboardLate',
                    width:235                    
                }     
            ]
        }
          
    ]    
});