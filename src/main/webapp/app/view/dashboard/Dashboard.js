Ext.define('Helpdesk.view.dashboard.Dashboard',{
    extend:'Ext.container.Container',
    alias:'widget.dashboard',    
    requires:[
        'Helpdesk.view.dashboard.DashboardUsersChart',
        'Helpdesk.view.dashboard.DashBoardStatusChart',
        'Helpdesk.view.dashboard.DashboardCategoryChart',
        'Helpdesk.view.dashboard.DataGridAgentControl',
        'Helpdesk.view.dashboard.DataGridClientControl',
        'Helpdesk.view.dashboard.TableTicketInformation'
    ],
    autoScroll:true,    
    items:[
        {
            xtype:'panel',
            layout:'hbox',
            bodyPadding:15,
            baseCls:'borless',            
            items:[
                {
                    xtype:'panel',
                    baseCls:'borless',
                    itemId:'leftPanel',
                    items:[
                        {
                            xtype:'panel',
                            title:translations.TICKETS_BY_CATEGORY,
                            width:600,
                            height:420,
                            collapsible:true,
                            padding:'0 0 20 0',
                            items:[
                                {
                                  xtype:'panel',
                                  padding:'5 0 5 5',
                                  baseCls:'bordless',
                                  html:'<a href="#reports">'+translations.SEE_FULL_REPORT+'</a>'
                                },
                                {
                                    xtype:'dashboardcategory',
                                    width:600,
                                    height:400
                                }
                            ]
                            
                        },
                        {
                            xtype:'panel',
                            itemId:'panelInfo',
                            width:600,
                            height:450,
                            title:translations.INFORMATIONS,
                            collapsible:true,
                            padding:'0 0 20 0',
                            items:[
                                {
                                  xtype:'panel',
                                  html:translations.TICKET_CONTROL,
                                  baseCls:'tickets-control-description',
                                  padding:'8 0 0 5',
                                  height:30
                                },
                                {
                                    xtype:'panel',
                                    baseCls:'bordless',
                                    layout:{
                                        type:'hbox'
                                    },
                                    items:[
                                        {
                                            xtype:'datagridagent',
                                            width:300,
                                            height:230
                                        },
                                        {
                                            xtype:'datagridclient',
                                            width:300,
                                            height:230
                                        }
                                    ]
                                },
                                {
                                    xtype:'text',
                                    text:translations.TICKET_CONTROL_INFORMATION,
                                    padding:'5 0 5 5'
                                },{
                                    xtye:'panel',
                                    baseCls:'bordless',
                                    items:[
                                        {
                                            xtype:'panel',
                                            baseCls:'tickets-control-description',
                                            padding:'8 0 0 5',
                                            html:translations.TICKET,
                                            height:30                                            
                                        },
                                        {
                                            xtype:'tableticket'
                                        }                                        
                                    ]
                                }
                                
                            ]                            
                        },
                        {
                            xtype:'panel',
                            title:translations.TICKETS_BY_USER,
                            width:600,
                            height:400,
                            collapsible:true,
                            items:[
                                {
                                    xtype:'dashboardusers',
                                    width:600,
                                    height:400
                                }
                            ]
                        },
                        {
                            xtype:'panel',
                            title:translations.TICKETS_STATUS,
                            width:600,
                            height:400,
                            collapsible:true,
                            padding:'20 0 0 0',
                            items:[
                                {
                                    xtype:'dashboardstatuschart',
                                    width:600,
                                    height:400
                                }
                            ]                            
                        }                        
                    ]
                },
                {
                    xtype:'panel',
                    itemId:'rightPanel',
                    baseCls:'bordless',
                    padding:'0 0 0 10',
                    
                    items:[
                        {
                            xtype:'panel',                            
                            height:115,
                            width:400,
                            bodyPadding:15,                            
                            items:[
                                {
                                  xtype:'text',
                                  baseCls:'bold-words-size15',
                                  text:'Seu plano: WebDesk',
                                  padding:'0 0 5 0'
                                },
                                {
                                  xtype:'form',
                                  style:{
                                      border:'0px solid black'
                                  }
                                },
                                {
                                    xtype:'text',
                                    baseCls:'bold-words-size15',
                                    itemId:'txtDescriptionPlan',
                                    padding:'10 0 0 0'
                                },
                                {
                                    xtype:'panel',
                                    padding:'10 0 0 0',
                                    baseCls:'bold-words-size15',       
                                    html:'<a href="https://login.locaweb.com.br/login?service=https%3A%2F%2Fcentraldocliente.locaweb.com.br%2Ftickets"> Solicite um plano maior pelo HelpDesk da Locaweb. </a> '
                                }
                            ]
                        },
                        {
                            xtype:'panel',
                            height:135,
                            width:400,
                            bodyPadding:15,
                            padding:'20 0 0 0',
                            items:[
                                {
                                    xtype:'text',
                                    text:translations.HELP_AND_SUPPORT,
                                    baseCls:'bold-words-size15',
                                    padding:'0 0 5 0'
                                },
                                {
                                  xtype:'form',
                                  style:{
                                      border:'0px solid black'
                                  }
                                },
                                {
                                    xtype:'panel',
                                    padding:'10 0 0 0',
                                    baseCls:'bold-words-size15',       
                                    html:'<a href="http://wiki.locaweb.com.br/pt-br/Webdesk"> Dúvidas sobre o WebDesk? Acesse nossa ajuda </a> '
                                },
                                {
                                    xtype:'panel',
                                    padding:'10 0 0 0',
                                    baseCls:'bold-words-size15',       
                                    html:'<a href="https://login.locaweb.com.br/login?service=https%3A%2F%2Fcentraldocliente.locaweb.com.br%2Ftickets"> Entre em contato com o suporte 24h. </a> '
                                }
                            ]
                        },
                        {
                            xtype:'panel',                            
                            height:265,
                            width:400,
                            bodyPadding:15, 
                            padding:'20 0 0 0',
                            items:[
                                {
                                  xtype:'text',
                                  baseCls:'bold-words-size15',
                                  text:translations.NEWS,
                                  padding:'0 0 5 0'
                                },
                                {
                                  xtype:'form',
                                  style:{
                                      border:'0px solid black'
                                  }
                                },
                                {
                                    xtype:'text',
                                    baseCls:'bold-words-size15',                                    
                                    padding:'5 0 0 0',
                                    text:'Criador de Sites Mobile agora tem nova opção'
                                },
                                {
                                    xtype:'text',
                                    padding:'5 0 0 0',
                                    text:'Chegou o novo Plano PLUS do Criador de Sites Mobile, \n\
                                          agora você pode criar seu site para celulares com quantas páginas ...'
                                }, 
                                {
                                    xtype:'text',
                                    baseCls:'bold-words-size15',                                    
                                    padding:'10 0 0 0',
                                    text:'Nova Revenda Email Marketing – tudo o que você \n precisa saber!'
                                },
                                {
                                    xtype:'text',
                                    padding:'5 0 0 0',
                                    text:'Temos uma novidade para contar: a partir deste mês está \n\
                                          disponível para contratação uma revenda de e-mail marketing \n\
                                          com a ...'
                                },
                                {
                                    xtype:'panel',
                                    padding:'10 0 0 0',
                                    baseCls:'bold-words-size15',       
                                    html:'<a href="https://blog.locaweb.com.br/categoria/produtos/saas/"> Veja mais no blog da Locaweb </a> '
                                }
                            ]
                        }
                    ]
                }
            ]            
        }
    ]
    
});