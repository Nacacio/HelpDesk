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
            html: translations.NO_RESPONSIBLE+': '           
        },
        {
            xtype:'panel',
            itemId:'noRespHtml'            
        },
        {
            xtype:'button',
            text:translations.SEE_TICKETS_WITHOUT_RESPONSIBLE,
            baseCls:'dashbord-links-buttons',
            itemId:'btnDashboardNoResp',
            width:235
        },
        
        // Tickets late
        {
            html: translations.LATE+': '
        },
        {
            xtype:'panel',
            itemId:'noRespLate'            
        },
        {
            xtype:'button',
            text:translations.SEE_TICKETS_LATE,
            baseCls:'dashbord-links-buttons',
            itemId:'btnDashboardLate',
            width:235
        },        
        // Tickets without a cayegory
        {
            html: translations.NO_CATEGORY+': '
        },
        {
            xtype:'panel',
            itemId:'noRespCat'           
        },
        {            
            xtype:'button',
            text:translations.SEE_TICKETS_WITHOUT_CATEGORY,
            baseCls:'dashbord-links-buttons',   
            itemId:'btnDashboardNoCat',
            width:235
        }
        
    ]    
});