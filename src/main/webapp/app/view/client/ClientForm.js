/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.client.ClientForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.clientform',
    requires: ['Helpdesk.util.Util'],
    bodyPadding: 15,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    defaults:{
      padding: '5 0 0 0'  
    },
    items: [
        {
            xtype: 'hiddenfield',
            fieldLabel: 'Label',
            name: 'id'
        },
        {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            itemId: 'groupClientName',
            border: 0,
            items: [
                {
                    xtype: 'label',
                    text: translations.NAME_CLIENT + ' (' + translations.REQUIRED + ')',
                    baseCls: 'new-label-title'
                },
                {
                    xtype: 'textfield',
                    itemId: 'clientName',
                    name: 'name'
                }
            ]

        },
        {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            itemId: 'groupClientEmail',
            border: 0,
            items: [
                {
                    xtype: 'label',
                    text: translations.EMAIL + ' (' + translations.REQUIRED + ')',
                    baseCls: 'new-label-title'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '',
                    itemId: 'clientEmail',
                    name: 'email'
                }
            ]

        },
        {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            itemId: 'groupClientEnterprise',
            border: 0,
            items: [
                {
                    xtype: 'label',
                    text: translations.ENTERPRISE,
                    baseCls: 'new-label-title'
                },
                {
                    xtype: 'textfield',
                    itemId: 'clientEnterprise',
                    name: 'enterprise'
                }
            ]

        },
        {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            itemId: 'groupClientObservations',
            border: 0,
            items: [
                {
                    xtype: 'label',
                    text: translations.OBSERVATIONS,
                    baseCls: 'new-label-title'
                },
                {
                    xtype: 'textarea',
                    itemId: 'clientObservations',
                    name: 'observations'
                }
            ]
        }
    ]
});
