/**
 * @Author: rafaelpossas
 * This controller will be called in the "configuration->users" window, and it will 
 * be responsible for listing, adding and editing users.
 * 
 * The userslists view is the dataGrid with the docked buttons and will dispatch
 * all the CRUD operatios for the USER MODEL.
 * 
 * Views:
 *    /view/user/Profile -> Window for creating/editing a new User
 *    /view/user/Users -> Panel that is added to the card layout
 *    /view/user/UsersList -> Data Grid with the CRUD operations
 */
Ext.define('Helpdesk.controller.User', {
    extend: 'Ext.app.Controller',
    requires: ['Helpdesk.store.Users', 'Helpdesk.util.Dialogs'],
    stores: ['Users'],
    views: ['user.Users', 'Helpdesk.view.user.Profile'],
    init: function() {
        this.control({
            'users button#add': {
                click: this.onButtonClickAdd
            },
            'users button#delete': {
                click: this.onButtonClickDelete
            },
            'users button#edit': {
                click: this.onButtonClickEdit
            },
            'profile button#save': {
                click: this.onButtonClickSave
            },
            'profile button#cancel': {
                click: this.onButtonClickCancel
            },
            'profile filefield': {
                change: this.onFilefieldChange
            }

        });
    },
    refs: [
        {
            ref: 'cardPanel',
            selector: 'viewport > container#maincardpanel'
        },
        {
            ref: 'settingsCardPanel',
            selector: 'settings > #settingscardpanel'
        },
        {
            ref: 'usersList',
            selector: 'users > userslist'
        },
        {
            ref: 'userPicture',
            selector: 'profile > userform image'
        }
    ],
    list: function() {
        var mainCardPanelIndex = this.getCardPanel().items.indexOf(this.getCardPanel().getLayout().getActiveItem());
        if (mainCardPanelIndex !== Helpdesk.Globals.settingsview) {
            this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.settingsview);
        }
        this.getSettingsCardPanel().getLayout().setActiveItem(Helpdesk.Globals.settings_users_view);
        this.getUsersList().getStore().load();
    },
    onButtonClickAdd: function(button, e, options) {
        var win = Ext.create('Helpdesk.view.user.Profile');
        win.setTitle(translations.ADD_NEW_USER);
        win.down('form').loadRecord(Ext.create('Helpdesk.model.User'));
        win.show();
    },
    onButtonClickEdit: function(button, e, options) {
        var grid = this.getUsersList(); // #1
        var record = grid.getSelectionModel().getSelection();
        if (record[0]) { // #2
            var editWindow = Ext.create('Helpdesk.view.user.Profile');
            editWindow.down('form').loadRecord(record[0]); // #3
            if (record[0].get('picture')) { //#4
                var img = editWindow.down('image');
                img.setSrc('resources/profileImages/' + record[0].get('picture'));
            }
            editWindow.setTitle(record[0].get('name')); // #5
            editWindow.show();
        }
    },
    onButtonClickCancel: function(button, e, options) {
        var win = button.up('window');
        win.close();
    },
    onButtonClickSave: function(button, e, options) {
        var win = button.up('window');
        var form = win.down('form');
        var record = form.getRecord();
        var values = form.getValues();
        record.set(values);
        this.getUsersStore().add(record);
        if (this.getUsersStore().getModifiedRecords().length > 0) {
            win.close();            
            this.getUsersStore().sync();            
            this.getUsersStore().load();
            this.getUsersList().getStore().load();
        } else {
            Ext.Msg.alert(translations.INFORMATION, translations.NOTHING_TO_SAVE);
        }
    },
    onFilefieldChange: function(filefield, value, options) {

        var file = filefield.fileInputEl.dom.files[0]; // #1

        var picture = this.getUserPicture(); // #2

        if (typeof FileReader !== "undefined" && (/image/i).test(file.type)) {                // #3
            var reader = new FileReader(); // #4
            reader.onload = function(e) {         // #5
                picture.setSrc(e.target.result); // #6
            };
            reader.readAsDataURL(file); // #7
        } else if (!(/image/i).test(file.type)) { // #8
            Ext.Msg.alert('Warning', 'You can only upload image files!');
            filefield.reset(); // #9
        }
    },
    onButtonClickDelete: function(button, e, options) {
        var grid = this.getUsersList();
        var record = grid.getSelectionModel().getSelection();
        var store = grid.getStore();
        Helpdesk.util.Dialogs.deleteDialog(function(buttonId) {
            if (buttonId === 'yes') {
                store.remove(record);
                store.sync();
            }
        });
    }
    
});