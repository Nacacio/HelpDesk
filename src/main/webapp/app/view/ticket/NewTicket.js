/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.ticket.NewTicket', {
    extend: 'Ext.form.Panel',
    alias: 'widget.newticket',
    requires: ['Helpdesk.view.category.CategoryComboBox',
        'Helpdesk.view.client.ClientComboBox',
        'Helpdesk.view.priority.PriorityComboBox',
        'Helpdesk.view.user.UserAdminComboBox',
        'Helpdesk.util.MultiUpload',
        'Helpdesk.model.Ticket'],
    listeners:{
        'afterrender': function(){
            this.configNewTicketScreen();
        }
    },
    bodyPadding: 5,
    border: 0,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    autoScroll: true,
    defaults:{
        border: 0
    },
    items: [
        {
            xtype: 'hiddenfield',
            fieldLabel: 'Label',
            name: 'id'
        },
        {
            xtype: 'hiddenfield',
            fieldLabel: 'Label',
            name: 'isOpen'
        },
        {
            xtype: 'hiddenfield',
            name: 'user'
        },
        {
            xtype: 'label',
            text: translations.NEW_TICKET,
            cls: 'title-new',
            margin: '0 0 30 0'            
        },
        {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            itemId: 'groupClientName',
            items: [
                {
                    xtype: 'label',
                    text: translations.NAME_CLIENT + ' (' + translations.REQUIRED + ')',
                    baseCls: 'new-label-title'
                },
                {
                    xtype: 'clientcombobox',
                    fieldLabel: '',
                    maxWidth: 252,
                    itemId: 'clientName',
                    
                    listeners: {
                        select: function(combo, records, eOpts) {
                            var form = this.up('form');
                            var record = form.getRecord();
                            var client = Helpdesk.util.Util.copy(records[0]);
                            record.set('client', client);
                            form.updateRecord(record);
                        }
                    }
                }
            ]

        },
        {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            itemId: 'groupClientNotRegistered',
            items: [
                {
                    xtype: 'label',
                    text: translations.IF_CLIENT_NOT_REGISTERED + ',',
                    baseCls: 'new-ticket-label'
                },
                {
                    xtype: 'button',
                    text: translations.CLICK_HERE,
                    baseCls: 'new-ticket-label-click',
                    itemId: 'addNewClient',
                    padding: '0 0 0 6'
                }
            ]
        },
        {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            itemId: 'groupCategory',
            items: [
                {
                    xtype: 'label',
                    text: translations.CATEGORY + ' (' + translations.REQUIRED + ')',
                    baseCls: 'new-label-title'
                },
                {
                    xtype: 'categorycombobox',
                    fieldLabel: '',
                    maxWidth: 252,
                    cls: 'new-ticket-item',
                    itemId: 'categoryTicket',
                    listeners: {
                        select: function(combo, records, eOpts) {
                            var form = this.up('form');
                            var record = form.getRecord();
                            var category = Helpdesk.util.Util.copy(records[0]);
                            record.set('category', category);
                            form.updateRecord(record);
                        }
                    }
                }
            ]
        },
        {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            itemId: 'groupStepsTicket',
            items: [
                {
                    xtype: 'label',
                    text: translations.STEPS_DESCRIPTION+ ' (' + translations.REQUIRED + ')',
                    baseCls: 'new-label-title'
                },
                {
                    xtype: 'textarea',
                    height: 88,
                    maxWidth: 773,
                    cls: 'new-ticket-item',
                    itemId: 'stepsTicket',
                    name: 'stepsTicket'
                }
            ]

        },
        {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            itemId: 'groupSubject',
            items: [
                {
                    xtype: 'label',
                    text: translations.SUBJECT + ' (' + translations.REQUIRED + ')',
                    baseCls: 'new-label-title'
                },
                {
                    xtype: 'textfield',
                    maxWidth: 773,
                    cls: 'new-ticket-item',
                    itemId: 'subject',
                    name: 'title'
                }
            ]

        },
        {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            itemId: 'groupEstimatePriorityResponsible',
            defaults:{
                border: 0
            },
            items: [
                {
                    

                    itemId: 'groupEstimateTime',
                    items: [
                        {
                            xtype: 'label',
                            text: translations.ESTIMATED_TIME,
                            baseCls: 'new-label-title'
                        },
                        {
                            xtype: 'datefield',
                            width: 252,
                            cls: 'new-ticket-item',
                            itemId: 'estimateTime',
                            padding: '0 7 0 0',
                            listeners: {
                                change: function(field, newValue, oldValue) {
                                    var form = this.up('form');
                                    var record = form.getRecord();
                                    var estimateTime = newValue;
                                    record.set('estimateTime', estimateTime);
                                    form.updateRecord(record);
                                }

                            }
                        }
                    ]
                },
                {
                    itemId: 'groupPriority',
                    items: [
                        {
                            xtype: 'label',
                            text: translations.PRIORITY,
                            baseCls: 'new-label-title'
                        },
                        {
                            xtype: 'prioritycombobox',
                            fieldLabel: '',
                            width: 252,
                            cls: 'new-ticket-item',
                            itemId:'priorityCmb',
                            padding: '0 7 0 0',
                            listeners: {
                                select: function(combo, records, eOpts) {
                                    var form = this.up('form');
                                    var record = form.getRecord();
                                    var priority = Helpdesk.util.Util.copy(records[0]);
                                    record.set('priority', priority);
                                    form.updateRecord(record);
                                }
                            }
                        }
                    ]
                },
                {
                    itemId: 'groupResponsible',
                    items: [
                        {
                            xtype: 'label',
                            text: translations.RESPONSIBLE,
                            baseCls: 'new-label-title'
                        },
                        {
                            xtype: 'responsiblescombobox',
                            fieldLabel: '',
                            width: 252,
                            cls: 'new-ticket-item',
                            itemId: 'responsibleTicket',
                            padding: '0 7 0 0',
                            listeners: {
                                select: function(combo, records, eOpts) {
                                    var form = this.up('form');
                                    var record = form.getRecord();
                                    var responsible = Helpdesk.util.Util.copy(records[0]);
                                    record.set('responsible', responsible);
                                    form.updateRecord(record);
                                }
                            }
                        }
                    ]
                }
            ]
        },
        {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            itemId: 'groupDescription',
            items: [
                {
                    xtype: 'label',
                    text: translations.DESCRIPTION + ' (' + translations.REQUIRED + ')',
                    baseCls: 'new-label-title'
                },
                {
                    xtype: 'textarea',
                    height: 88,
                    maxWidth: 773,
                    cls: 'new-ticket-item',
                    itemId: 'description',
                    name: 'description'
                }
            ]

        },
        {
            xtype: 'multiupload'           
        },
        {
            xtype: 'button',
            itemId: 'addTicket',
            text: translations.ADD,
            maxWidth: 104,
            height: 37,
            margin: '10 0 0 0',
            baseCls: 'new-ticket-save-button'
        }
    ],
    
    configNewTicketScreen:function() {
        var usergroup = Helpdesk.Globals.userLogged.userGroup;
        this.loadRecord(Ext.create('Helpdesk.model.Ticket'));
        
        var groupClientName = this.getComponent('groupClientName');
        var groupClientNotRegistered = this.getComponent('groupClientNotRegistered');
        var groupEstimatePriorityResponsible = this.getComponent('groupEstimatePriorityResponsible');
       
        if (usergroup.id === 1) {
            groupClientName.setVisible(true);
            groupClientNotRegistered.setVisible(true);
            groupEstimatePriorityResponsible.setVisible(true);
        } else {
            groupClientName.setVisible(false);
            groupClientNotRegistered.setVisible(false);
            groupEstimatePriorityResponsible.setVisible(false);
        }
    }
        
});

