/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.ticket.EditTicket', {
    extend: 'Ext.container.Container',
    alias: 'widget.editticket',
    border: 0,
    layout: 'card',
    width:800,
    items:[
        {
            xtype:'form',
            bodyPadding:15,
            layout:{
                type:'vbox'
            },
            padding: '20 0 0 0',
            items:[ 
                {
                    xtype:'container',
                    baseCls:'bordless',                    
                    layout:{
                        type:'hbox'                      
                    },
                    items:[                        
                        {
                            xtype:'panel',                            
                            baseCls:'bordless',                            
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_CATEGORY,                                    
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype:'text',
                                    itemId:'tktCategory',                               
                                    baseCls:'description-ticket',
                                    width: 250,
                                    height: 30
                                }                               
                            ]
                        },
                        {
                            xtype:'panel',    
                            baseCls:'bordless',
                            padding:'0 0 0 200',
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_ESTIMATED_TIME,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype:'text',
                                    itemId:'tktEstimatedTime',
                                    baseCls:'description-ticket',   
                                    width: 250,
                                    height: 30,
                                    emptyText: translations.WITHOUT_DEADLINE
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype:'panel',
                    width:770,
                    height:1,  
                    padding:'10 0 10 0'
                },
                {
                    xtype:'container',
                    baseCls:'bordless',
                    padding:'20 0 0 0',                    
                    layout:{
                        type:'hbox'
                    },
                    items:[
                        {
                            xtype:'panel',
                            flex:1,
                            baseCls:'bordless',
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_PRIORITY,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype:'text',
                                    itemId:'tktPriority',
                                    baseCls:'description-ticket',
                                    width: 250,
                                    height: 30
                                }
                            ]
                        },
                        {
                            xtype:'panel',
                            padding:'0 0 0 200',
                            baseCls:'bordless',                            
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.RESPONSIBLE,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype:'text',
                                    itemId:'tktResponsible',
                                    baseCls:'description-ticket', 
                                    width: 250,
                                    height: 30
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype:'panel',
                    width:770,
                    height:1,  
                    padding:'10 0 10 0'
                },
                {
                    xtype:'panel',
                    baseCls:'bordless',
                    padding:'20 0 10 0',
                    layout:{
                        type:'hbox'
                    },
                    items:[
                        {
                            xtype:'panel',
                            baseCls:'bordless',
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_PROBLEM_STEPS,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype:'text',
                                    itemId:'tktSteps',
                                    baseCls:'description-ticket'
                                }
                            ]
                        }
                    ]
                },                            
                {
                    xtype:'container',
                    layout: {
                        type: 'vbox',
                        align: 'right'
                    },
                    width: 770,
                    items:[
                        {
                            xtype: 'button',
                            text: translations.EDIT,
                            iconCls:'edit_ticket',
                            cls: 'btn-ticket-details-edit',
                            itemId: 'editTicket'
                        }
                    ]
                }
            ]
        },
        {
            xtype:'form',
            bodyPadding:15,
            layout:{
                type:'vbox'
            },
            padding: '20 0 0 0',
            items:[ 
                {
                    xtype:'container',
                    baseCls:'bordless',                    
                    layout:{
                        type:'hbox'                       
                    },
                    items:[                        
                        {
                            xtype:'panel',                            
                            baseCls:'bordless',                            
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_CATEGORY,                                    
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype: 'categorycombobox',
                                    fieldLabel: '',
                                    cls: 'new-ticket-item',
                                    itemId: 'categoryTicket',
                                    width: 250
                                }                              
                            ]
                        },
                        {
                            xtype:'panel',    
                            baseCls:'bordless',
                            padding:'0 0 0 200',
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_ESTIMATED_TIME,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype: 'datefield',
                                    width: 250,
                                    cls: 'new-ticket-item',
                                    itemId: 'estimateTime',
                                    emptyText: translations.WITHOUT_DEADLINE
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype:'panel',
                    width:770,
                    height:1,  
                    padding:'10 0 10 0'
                },
                {
                    xtype:'container',
                    baseCls:'bordless',
                    padding:'20 0 0 0',                    
                    layout:{
                        type:'hbox'
                    },
                    items:[
                        {
                            xtype:'panel',
                            flex:1,
                            baseCls:'bordless',
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_PRIORITY,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype: 'prioritycombobox',
                                    fieldLabel: '',
                                    width: 250,
                                    cls: 'new-ticket-item',
                                    itemId: 'priorityTicket'                                    
                                }
                            ]
                        },
                        {
                            xtype:'panel',
                            padding:'0 0 0 200',
                            baseCls:'bordless',                            
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.RESPONSIBLE,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype: 'responsiblescombobox',
                                    fieldLabel: '',
                                    width: 250,
                                    cls: 'new-ticket-item',
                                    itemId: 'responsibleTicket',
                                    padding: '0 7 0 0'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype:'panel',
                    width:770,
                    height:1,  
                    padding:'10 0 10 0'
                },
                {
                    xtype:'panel',
                    baseCls:'bordless',
                    padding:'20 0 10 0',
                    layout:{
                        type:'hbox'
                    },
                    items:[
                        {
                            xtype:'panel',
                            baseCls:'bordless',
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_PROBLEM_STEPS,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype: 'textarea',
                                    itemId: 'stepsTicket',
                                    height: 100,
                                    width: 770,
                                    cls: 'new-ticket-item',
                                    padding: '10 0 10 0'
                                }
                            ]
                        }
                    ]
                },                            
                {
                    xtype:'container',
                    layout: {
                        type: 'vbox',
                        align: 'right'
                    },
                    width: 770,
                    items:[
                        {
                            xtype: 'button',
                            text: translations.SAVE,
                            itemId: 'btnSaveEditTicket',
                            height: 37,
                            width: 100,
                            baseCls: 'new-ticket-save-button'
                        }
                    ]
                }
            ]
        }
    ]
        
});

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.ticket.EditTicket', {
    extend: 'Ext.container.Container',
    alias: 'widget.editticket',
    border: 0,
    layout: 'card',
    width:800,
    items:[
        {
            xtype:'form',
            bodyPadding:15,
            layout:{
                type:'vbox'
            },
            padding: '20 0 0 0',
            items:[ 
                {
                    xtype:'container',
                    baseCls:'bordless',                    
                    layout:{
                        type:'hbox'                      
                    },
                    items:[                        
                        {
                            xtype:'panel',                            
                            baseCls:'bordless',                            
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_CATEGORY,                                    
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype:'text',
                                    itemId:'tktCategory',                               
                                    baseCls:'description-ticket',
                                    width: 250,
                                    height: 30
                                }                               
                            ]
                        },
                        {
                            xtype:'panel',    
                            baseCls:'bordless',
                            padding:'0 0 0 200',
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_ESTIMATED_TIME,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype:'text',
                                    itemId:'tktEstimatedTime',
                                    baseCls:'description-ticket',   
                                    width: 250,
                                    height: 30,
                                    emptyText: translations.WITHOUT_DEADLINE
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype:'panel',
                    width:770,
                    height:1,  
                    padding:'10 0 10 0'
                },
                {
                    xtype:'container',
                    baseCls:'bordless',
                    padding:'20 0 0 0',                    
                    layout:{
                        type:'hbox'
                    },
                    items:[
                        {
                            xtype:'panel',
                            flex:1,
                            baseCls:'bordless',
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_PRIORITY,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype:'text',
                                    itemId:'tktPriority',
                                    baseCls:'description-ticket',
                                    width: 250,
                                    height: 30
                                }
                            ]
                        },
                        {
                            xtype:'panel',
                            padding:'0 0 0 200',
                            baseCls:'bordless',                            
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.RESPONSIBLE,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype:'text',
                                    itemId:'tktResponsible',
                                    baseCls:'description-ticket', 
                                    width: 250,
                                    height: 30
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype:'panel',
                    width:770,
                    height:1,  
                    padding:'10 0 10 0'
                },
                {
                    xtype:'panel',
                    baseCls:'bordless',
                    padding:'20 0 10 0',
                    layout:{
                        type:'hbox'
                    },
                    items:[
                        {
                            xtype:'panel',
                            baseCls:'bordless',
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_PROBLEM_STEPS,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype:'text',
                                    itemId:'tktSteps',
                                    baseCls:'description-ticket'
                                }
                            ]
                        }
                    ]
                },                            
                {
                    xtype:'container',
                    layout: {
                        type: 'vbox',
                        align: 'right'
                    },
                    width: 770,
                    items:[
                        {
                            xtype: 'button',
                            text: translations.EDIT,
                            iconCls:'edit_ticket',
                            cls: 'btn-ticket-details-edit',
                            itemId: 'editTicket'
                        }
                    ]
                }
            ]
        },
        {
            xtype:'form',
            itemId:'formEditTicket',
            bodyPadding:15,
            layout:{
                type:'vbox'
            },
            padding: '20 0 0 0',
            items:[
                
                {
                    xtype:'container',
                    baseCls:'bordless',                    
                    layout:{
                        type:'hbox'                       
                    },
                    items:[                        
                        {
                            xtype:'panel',                            
                            baseCls:'bordless',                            
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_CATEGORY,                                    
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype: 'categorycombobox',
                                    fieldLabel: '',
                                    cls: 'new-ticket-item',
                                    itemId: 'categoryTicket',
                                    width: 250
                                }                              
                            ]
                        },
                        {
                            xtype:'panel',    
                            baseCls:'bordless',
                            padding:'0 0 0 200',
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_ESTIMATED_TIME,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype: 'datefield',
                                    width: 250,
                                    cls: 'new-ticket-item',
                                    itemId: 'estimateTime',
                                    emptyText: translations.WITHOUT_DEADLINE
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype:'panel',
                    width:770,
                    height:1,  
                    padding:'10 0 10 0'
                },
                {
                    xtype:'container',
                    baseCls:'bordless',
                    padding:'20 0 0 0',                    
                    layout:{
                        type:'hbox'
                    },
                    items:[
                        {
                            xtype:'panel',
                            flex:1,
                            baseCls:'bordless',
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_PRIORITY,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype: 'prioritycombobox',
                                    fieldLabel: '',
                                    width: 250,
                                    cls: 'new-ticket-item',
                                    itemId: 'priorityTicket'                                    
                                }
                            ]
                        },
                        {
                            xtype:'panel',
                            padding:'0 0 0 200',
                            baseCls:'bordless',                            
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.RESPONSIBLE,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype: 'responsiblescombobox',
                                    fieldLabel: '',
                                    width: 250,
                                    cls: 'new-ticket-item',
                                    itemId: 'responsibleTicket',
                                    padding: '0 7 0 0'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype:'panel',
                    width:770,
                    height:1,  
                    padding:'10 0 10 0'
                },
                {
                    xtype:'panel',
                    baseCls:'bordless',
                    padding:'20 0 10 0',
                    layout:{
                        type:'hbox'
                    },
                    items:[
                        {
                            xtype:'panel',
                            baseCls:'bordless',
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.TICKET_PROBLEM_STEPS,
                                    baseCls:'description-ticket-bold'
                                },
                                {
                                    xtype: 'textarea',
                                    itemId: 'stepsTicket',
                                    height: 100,
                                    width: 770,
                                    cls: 'new-ticket-item',
                                    padding: '10 0 10 0'
                                }
                            ]
                        }
                    ]
                },                            
                {
                    xtype:'container',
                    layout: {
                        type: 'vbox',
                        align: 'right'
                    },
                    width: 770,
                    items:[
                        {
                            xtype: 'button',
                            text: translations.SAVE,
                            itemId: 'btnSaveEditTicket',
                            height: 37,
                            width: 100,
                            baseCls: 'new-ticket-save-button'
                        }
                    ]
                }
            ]
        }
    ]
        
});

