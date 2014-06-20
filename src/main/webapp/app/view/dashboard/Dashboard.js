Ext.define('Helpdesk.view.dashboard.Dashboard', {
    extend: 'Ext.container.Container',
    alias: 'widget.dashboard',
    requires: [
        'Helpdesk.view.dashboard.DashboardUsersChart',
        'Helpdesk.view.dashboard.DashBoardStatusChart',
        'Helpdesk.view.dashboard.DashboardCategoryChart',
        'Helpdesk.view.dashboard.DataGridAgentControl',
        'Helpdesk.view.dashboard.DataGridClientControl',
        'Helpdesk.view.dashboard.TableTicketInformation'
    ],
    autoScroll: true,
    items: [
        {
            xtype: 'panel',
            layout: 'hbox',
            bodyPadding: 15,
            baseCls: 'borless',
            items: [
                {
                    xtype: 'panel',
                    baseCls: 'borless',
                    itemId: 'leftPanel',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'panel',
                            title: translations.TICKETS_BY_CATEGORY,
                            width: 600,
                            height: 450,
                            collapsible: true,
                            padding: '0 0 0 0',
                            items: [
                                {
                                    xtype: 'panel',
                                    padding: '5 0 5 5',
                                    baseCls: 'bordless',
                                    html: '<a href="#reports">' + translations.SEE_FULL_REPORT + '</a>'
                                },
                                {
                                    xtype: 'dashboardcategory',
                                    width: 600,
                                    height: 400
                                }
                            ]

                        },
                        {
                            xtype: 'panel',
                            title: translations.TICKETS_BY_USER,
                            width: 600,
                            height: 440,
                            margin: '10 0 0 0',
                            collapsible: true,
                            items: [
                                {
                                    xtype: 'dashboardusers',
                                    width: 600,
                                    height: 400
                                }
                            ]
                        }


                    ]
                },
                {
                    layout: 'vbox',
                    border: 0,
                    items: [
                        {
                            xtype: 'panel',
                            itemId: 'panelInfo',
                            width: 600,
                            height: 450,
                            title: translations.INFORMATIONS,
                            collapsible: true,
                            padding: '0 0 0 10',
                            items: [
                                {
                                    xtype: 'panel',
                                    html: translations.TICKET_CONTROL,
                                    baseCls: 'tickets-control-description',
                                    padding: '8 0 0 5',
                                    height: 30
                                },
                                {
                                    xtype: 'panel',
                                    baseCls: 'bordless',
                                    layout: {
                                        type: 'hbox'
                                    },
                                    items: [
                                        {
                                            margin: '2 2 2 2',
                                            xtype: 'datagridagent',
                                            width: 300,
                                            height: 230
                                        },
                                        {
                                            margin: '2 2 2 0',
                                            xtype: 'datagridclient',
                                            width: 300,
                                            height: 230
                                        }
                                    ]
                                },                                
                                {
                                    xtye: 'panel',
                                    baseCls: 'bordless',
                                    items: [
                                        {
                                            xtype: 'panel',
                                            baseCls: 'tickets-control-description',
                                            padding: '8 0 0 5',
                                            html: translations.TICKET,
                                            height: 30
                                        },
                                        {
                                            xtype: 'tableticket'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            title: translations.TICKETS_STATUS,
                            width: 600,
                            height: 450,
                            collapsible: true,
                            padding: '10 0 0 10',
                            items: [
                                {
                                    xtype: 'dashboardstatuschart',
                                    width: 600,
                                    height: 400
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]

});