/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.controller.Perfil', {
    extend: 'Ext.app.Controller',
    views: ['Helpdesk.view.perfil.Perfil'],
    init: function() {
        this.control({
            'perfil #perfilSideMenuPanel > button': {
                click: this.onSideMenuButtonClick
            }
        });
    },
    refs: [
        {
            ref: 'cardPanel',
            selector: 'viewport > container#maincardpanel'
        },
        {
            ref: 'perfilCardPanel',
            selector: 'perfil > #perfilcardpanel'
        }     
    ],
    index: function() {
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.perfilview);
        this.getPerfilCardPanel().getLayout().setActiveItem(Helpdesk.Globals.perfil_detalhes_view);
    },    
    onSideMenuButtonClick: function(btn){
        if( btn.itemId === 'buttonPerfil' ){
            this.getPerfilCardPanel().getLayout().setActiveItem(Helpdesk.Globals.perfil_detalhes_view);
        }
        else if( btn.itemId === 'buttonPassword' ){
            this.getPerfilCardPanel().getLayout().setActiveItem(Helpdesk.Globals.perfil_senha_view);
        }
    }
});

