/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.controller.Client', {
    extend: 'Ext.app.Controller',
    stores: ['Clients'],
    views: ['client.Client'],
    init: function() {
        this.control({
            'client button#addClient': {
                click: this.onButtonClickAdd
            },
            'client button#deleteClient': {
                click: this.onButtonClickDelete
            },
            'client button#saveClient': {
                click: this.onButtonClickSave
            }
        });
    },
    refs: [
        {
            ref: 'clientGrid',
            selector: 'client > clientgrid'
        }
    ],
    
    /**
     * Adiciona um novo Client ao grid
     */
    onButtonClickAdd: function(button, e, options){
        var rec = new Helpdesk.model.Client();
        var grid = this.getClientGrid();
        grid.getStore().insert(0, rec);
        grid.editingPlugin.startEdit(rec,1);
    },
    
    /**
     * Remove Client selecionada, verificando se algum registro foi alterado.
     */
    onButtonClickDelete: function(button, e, options) {
        var grid = this.getClientGrid();
        var record = grid.getSelectionModel().getSelection();
        var store = grid.getStore();
        if (store.getModifiedRecords().length > 0) {
            Helpdesk.util.Dialogs.lostChangesDialog(function(buttonId) {                
                if (buttonId === 'yes') {                    
                    Helpdesk.util.Dialogs.deleteDialog(function(buttonId) {
                        if (buttonId === 'yes') {
                            store.load({callback:function(){
                                    store.remove(record);
                                    store.sync();   
                                }
                            });                            
                        }
                    });
                }
            });
        }
        else{
            Helpdesk.util.Dialogs.deleteDialog(function(buttonId) {
                if (buttonId === 'yes') {
                    store.remove(record);
                    store.sync();
                }
            });
        }
    },
    
    /**
     * Salva as informações modificadas na Store
     */
    onButtonClickSave: function(button, e, options){
        this.getClientGrid().getStore().sync({
            callback:function(){
                Ext.Msg.alert(translations.INFORMATION,translations.CLIENT+' '+ translations.SAVED_WITH_SUCCESS+'!');
            }
        });
    }
});

