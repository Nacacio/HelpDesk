/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.util.Dialogs',{
   statics:{
       deleteDialog: function(callback){
                   Ext.Msg.show({
            title: translations.DELETE+'?',
            msg: translations.DELETE_CONFIRMATION,
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: callback
        });
       },
       lostChangesDialog: function(callback){
            Ext.Msg.show({
            title: translations.INFORMATION+'!',
            msg: translations.CHANGE_LOST,
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: callback
        });
       }
   } 
});

