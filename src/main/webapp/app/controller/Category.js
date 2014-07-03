/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.controller.Category', {
    extend: 'Ext.app.Controller',
    requires: ['Helpdesk.store.Categories'],
    stores: ['Categories'],
    views: ['category.Category'],
    init: function() {
        this.control({
            'category button#addCategory': {
                click: this.onButtonClickAdd
            },
            'category button#deleteCategory': {
                click: this.onButtonClickDelete
            },
            'category button#saveCategory': {
                click: this.onButtonClickSave
            }
        });
    },
    refs: [
        {
            ref: 'categoryGrid',
            selector: 'category > categorygrid'
        }
    ],
    /**
     * Adiciona uma nova Category ao grid
     */
    onButtonClickAdd: function(button, e, options){
        var rec = new Helpdesk.model.Category();
        var grid = this.getCategoryGrid();
        grid.getStore().insert(0, rec);
        grid.editingPlugin.startEdit(rec,1);
    },
    
    /**
     * Remove Category selecionada, verificando se algum registro foi alterado.
     */
    onButtonClickDelete: function(button, e, options) {
        var grid = this.getCategoryGrid();
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
        this.getCategoryGrid().getStore().sync({
            callback:function(){
                Ext.Msg.alert(translations.INFORMATION,translations.CATEGORY+' '+ translations.SAVED_WITH_SUCCESS+'!');
            }
        });
    }
    
});

