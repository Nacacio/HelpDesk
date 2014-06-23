Ext.define('Helpdesk.view.ticket.TicketDetails',{
    extend:'Ext.container.Container',    
    alias:'widget.ticketdetails', 
    requires: [
      'Helpdesk.util.MultiUpload'  
    ],
    bodyPadding: 5,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    autoScroll: true,
    items:[        
        {
            xtype:'form',
            baseCls:'bordless',
            itemId:'ticketMainView',
            width:800,
            items:[
                {
                    xtype:'form',
                    bodyPadding:15,            
                    width:800,  
                    hidden:true,
                    style:{
                        'border': 'solid 2px #FFA500'
                    },
                    layout:{
                        type:'vbox'
                    },
                    items:[
                        {
                            xtype:'text',
                            padding:'0 0 10 0',
                            text:translations.TICKET_IMPORTANT_WARNING,
                            style:{
                                'font-weight':'bold'
                            }
                        },
                        {
                            xtype:'text',
                            text:translations.TICKET_HAS_ATTACHMENT
                        } ,{
                            xtype:'text',
                            text:translations.TICKET_RECOMENDATIONS
                        } 
                    ]
                    
                },
                {
                    xtype:'tbfill',
                    padding:'0 0 20 0'
                },
                {
                    xtype:'form',            
                    bodyPadding:15,
                    width:800,
                    baseCls:'grey-background',
                    layout:{
                        type:'vbox'
                    },
                    items:[                
                        {
                            xtype:'text',
                            iconCls:'ticket_open',
                            itemId:'tktStatus',
                            style:{
                                'font-size':'15'
                            }
                        },
                        {                    
                            xtype:'text',
                            width:800,                    
                            maxWidth:800,
                            itemId:'tktTitle',
                            name:translations.TICKET_TITLE,
                            padding:'20 0 0 0',
                            style:{
                                'font-weigth':'bold',
                                'font-size':'30'
                            }
                        },
                        {
                            xtype:'form',
                            padding:'20 0 0 0',
                            baseCls:'bordless-and-grey-background',
                            border: 0,
                            layout:{
                                type:'hbox'
                            },
                            items:[
                                {
                                    xtype:'text',
                                    text: translations.BY,
                                    style:{                                
                                        'font-size':'14'
                                    }
                                },
                                {
                                    xtype:'text',
                                    itemId:'tktBy',
                                    cls:'font_style_header',
                                    padding: '1 10 0 20'
                                },
                                {
                                    xtype:'tbfill',
                                    padding:'0 10 0 0'
                                },
                                {
                                    xtype:'text',
                                    text: translations.AT.toLowerCase(),
                                    style:{                                
                                        'font-size':'14'
                                    }
                                },
                                {
                                    xtype:'text',
                                    itemId:'tktAt', 
                                    padding: '0 10 0 20',
                                    style:{                                
                                        'font-size':'14'
                                    }
                                }
                            ]                   
                        }                
                    ]            
                },                
                {
                    xtype: 'editticket',
                    itemId: 'ticketEditContainer'
                },
                {
                    xtype:'text',
                    text:translations.TICKET_HISTORY,
                    baseCls:'bold-words',
                    padding:'20 0 0 0',
                    style:{                                
                        'font-size':'14'
                    }
                },
                {
                    xtype:'panel',
                    padding:'20 0 0 0',
                    itemId:'tktAnswers',
                    width:800,
                    border: 0,
                    defaults: {
                        // applied to each contained panel
                        bodyStyle: 'padding:15px'            
                    },
                    items:[
                        
                    ]
                },       
                {
                    xtype:'text',
                    itemId: 'txtNewAnswer',
                    text:translations.TICKET_NEW_ANSWER,
                    padding:'20 0 0 0',
                    baseCls:'bold-words'
                },
                {
                    xtype:'textarea',
                    itemId:'tktNewAnswer',
                    height:100,
                    width:800,
                    padding:'5 0 15 0'            
                },                
                {
                    xtype: 'multiupload',
                    padding: '0 0 10 0'
                },
                {
                    xtype:'panel',
                    baseCls:'bordless',
                    width: 800,
                    layout:{
                        type:'hbox'
                    },
                    items:[
                        {
                            xtype:'button',
                            text:translations.SAVE,
                            id:'btnSaveAnswTkt',
                            width:90,
                            baseCls:'btn-save-changes'
                        },
                        {
                            xtype:'container',
                            flex:1
                        },
                        {
                            xtype:'label',
                            text:translations.TICKET_OPENED,
                            itemId:'lblTicketOpen',
                            baseCls:'font15',
                            padding:'10 20 0 14'
                        },                        
                        {
                            xtype:'button',                            
                            text:translations.CLOSE_TICKET,                            
                            id:'btnCloseTkt',
                            width:130,                            
                            baseCls:'btn-grey'                           
                        },
                        {
                            xtype:'label',
                            text: translations.TICKET_CLOSED,
                            itemId:'lblTicketClosed',
                            baseCls:'font15',
                            padding:'10 20 0 2'
                        },                        
                        {
                            xtype:'button',                            
                            text:translations.RE_OPEN_TICKET,               
                            id:'btnOpenTkt',
                            width:130,                            
                            baseCls:'btn-grey'                           
                        }     
                    ]
                }               
            ]
        }       
    ]   
});