/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.user.Profile', {
    extend: 'Ext.window.Window',
    alias: 'widget.profile',
    height: 290,
    width: 550,
    requires: ['Helpdesk.util.Util','Helpdesk.view.user.UserForm'],
    scope: this,
    itemId: 'profileWindow',
    layout: {
        type: 'fit'
    },
    items: [
        {
            xtype: 'userform'
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
                    text: translations.CANCEL,
                    itemId: 'cancel',
                    iconCls: 'cancel_16'
                },
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

