/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.settings.SettingsSideMenu', {
    extend: 'Ext.panel.Panel',
    layout: 'vbox',
    alias: 'widget.settingssidemenu',
    bodyCls: 'default_background',
    padding: '10 0 10 0',
    border: 0,
    defaults: {
        toggleGroup: 'sidemenu-settings',
        allowDepress: false,
        xtype: 'button',
        width: 180,
        baseCls: 'sidemenu-button'
    },
    items: [
        {
            text: translations.USERS,
            itemId: 'user',
            pressed: true
        },        
        {
            text: translations.CATEGORY,
            itemId: 'category'
        },
        {
            text: translations.CLIENT,
            itemId: 'client'
        },
        {
            text: translations.PRIORITY,
            itemId: 'priority'
        },
        {
            xtype: 'tbfill'  
        }
    ]
});

