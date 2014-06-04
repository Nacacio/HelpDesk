/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.perfil.PerfilSideMenu', {
    extend: 'Ext.panel.Panel',
    layout: 'vbox',
    alias: 'widget.perfilsidemenu',
    bodyCls: 'default_background',
    padding: '10 0 10 0',
    border: 0,
   defaults: {
        toggleGroup: 'sidemenu-perfil',
        allowDepress: false,
        xtype: 'button',
        width: 180,
        baseCls: 'sidemenu-button'
    },
    items: [
        {
            text: translations.MY_PROFILE,
            itemId: 'buttonPerfil',
            pressed: true
        },    
        {
            xtype: 'button',
            text: translations.PASSWORD,
            itemId: 'buttonPassword'
        },  
        {
            xtype: 'tbfill'  
        }
    ]
});

