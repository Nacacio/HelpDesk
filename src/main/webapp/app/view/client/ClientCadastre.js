/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.client.ClientCadastre', {
    extend: 'Ext.window.Window',
    alias: 'widget.clientcadastre',
    height: 330,
    width: 550,
    requires: ['Helpdesk.util.Util','Helpdesk.view.client.ClientForm'],
    scope: this,
    border: 0,
    title: '',
    layout: {
        type: 'fit'
    },
    items: [
        {
            xtype: 'clientform',
            itemId: 'form'
        }
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            flex: 1,
            dock: 'bottom',
            ui: 'footer',
            layout: {
                pack: 'end', // #1
                type: 'hbox'
            },
            items: [
                {
                    xtype: 'button',
                    text: translations.SAVE,
                    itemId: 'save',
                    iconCls: 'save_16'
                }
            ]
        }
    ]
});

