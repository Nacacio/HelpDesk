/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.perfil.Perfil', {
    extend: 'Ext.container.Container',
    alias: 'widget.perfil',
    layout: {
        type: 'border'
    },
    requires: [
        'Helpdesk.view.Translation','Helpdesk.view.perfil.PerfilSideMenu','Helpdesk.view.perfil.MeuPerfilForm','Helpdesk.view.perfil.SenhaForm'
    ],
    items: [
        
        {
            xtype: 'perfilsidemenu',
            region: 'west',
            itemId:'perfilSideMenuPanel'
        },
        {
            xtype: 'container',
            region: 'center',
            layout: 'card',
            itemId: 'perfilcardpanel',
            border:0,
            cls:'background-white-and-shadow',
            
            items:[
                {
                    xtype: 'meuperfilform'
                },
                {
                    xtype: 'meuperfilsenhaform'
                }
            ]
        }
    ]
});
