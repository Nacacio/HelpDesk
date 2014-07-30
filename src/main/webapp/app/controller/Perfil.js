+/* 
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
            },
            'meuperfilsenhaform button#salvarButton':{
                click: this.saveChangesPassword
            },
            'meuperfilform button#salvarButton':{
                click: this.saveChangesProfile                
            }
            
        });
    },
    stores:['Users'],
    refs: [
        {
            ref: 'cardPanel',
            selector: 'viewport > container#maincardpanel'
        },
        {
            ref: 'perfilCardPanel',
            selector: 'perfil > #perfilcardpanel'
        },
        {
            ref:'emailMainHeader',
            selector:'mainheader > container > label#emailMainHeader'
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
    },
    
    saveChangesProfile:function(button){
        
        var form = button.up();
        var values = form.getValues();        
        var store = this.getUsersStore();
        var myScope = this;
        
        store.proxy.url = 'user/'+Helpdesk.Globals.user;
        store.load({
            callback:function(){
               store.proxy.url = 'user';
               var record = Ext.create('Helpdesk.model.User',{
                    id: store.data.items[0].data.id,
                    name: values.name,
                    userName: store.data.items[0].data.userName,                    
                    password: store.data.items[0].data.password,
                    client: store.data.items[0].data.client,
                    isEnabled: store.data.items[0].data.isEnabled,
                    email: values.email,
                    userGroup: store.data.items[0].data.userGroup,
                    userGroupName: store.data.items[0].data.userGroupName,
                    clientName: store.data.items[0].data.clientName,                    
                });               
               record.dirty = true;
               store.add(record);               
               store.sync({
                   callback:function(){                       
                       form.down('textfield#nameProfile').setValue(values.name);
                       form.down('textfield#emailProfile').setValue(values.email);
                       //Atualiza o email na barra de informações
                       myScope.getEmailMainHeader().setText(values.email);
                   }
               });              
            }            
        });
        
    },
    
    //Salva a mudança de senha do usuário
    saveChangesPassword:function(button){
        
        var form = button.up();
        var values = form.getValues();        
        var store = this.getUsersStore();        
        
        store.proxy.url = 'user/'+Helpdesk.Globals.user;
        store.load({
            callback:function(){
               store.proxy.url = 'user';
               var record = Ext.create('Helpdesk.model.User',{
                    id: store.data.items[0].data.id,
                    name: store.data.items[0].data.name,
                    userName: store.data.items[0].data.userName,
                    //Seta a nova senha digitada
                    password: values.password,
                    client: store.data.items[0].data.client,
                    isEnabled: store.data.items[0].data.isEnabled,
                    email: store.data.items[0].data.email,
                    userGroup: store.data.items[0].data.userGroup,
                    userGroupName: store.data.items[0].data.userGroupName,
                    clientName: store.data.items[0].data.clientName,                    
                });               
               record.dirty = true;
               store.add(record);               
               store.sync({
                   callback:function(){                       
                       form.down('textfield#pass').setValue('');
                       form.down('textfield#passCheck').setValue('');
                   }
               });              
            }            
        });
           
    }
});

