/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('Helpdesk.view.Translation', {
    extend: 'Ext.button.Split',  // #2
    alias: 'widget.translation',
    menu: Ext.create('Ext.menu.Menu', { // #3
        items: [
            {
                xtype: 'menuitem',  // #4
                iconCls: 'en',
                text: translations.ENGLISH
            },
            {
                xtype: 'menuitem',  // #5
                iconCls: 'es',
                text: translations.SPANISH
            },
            {
                xtype: 'menuitem',  // #6
                iconCls: 'pt_BR',
                text: translations.PORTUGUESE
            }
        ]
    })
});
