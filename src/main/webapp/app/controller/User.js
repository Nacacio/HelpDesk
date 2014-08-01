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
    views: ['user.Users', 'Helpdesk.view.user.Profile', 'Helpdesk.view.user.UsersList', 'Helpdesk.view.user.UserForm'],
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
            '#userGrid': {
                itemdblclick: this.onUserDblClick
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
        var form = win.down('form');
        form.loadRecord(Ext.create('Helpdesk.model.User'));
        var checkState = form.down('checkbox#checkState');
        checkState.setValue(true);
        win.show();
    },
    onButtonClickEdit: function(button, e, options) {
        var grid = this.getUsersList(); // #1
        var record = grid.getSelectionModel().getSelection();
        if (record[0]) { // #2
            this.openTitleWindowEditUser(record[0]);
        }
    },
    onButtonClickCancel: function(button, e, options) {
        var win = button.up('window');
        win.close();
    },
    onButtonClickSave: function(button, e, options) {
        var win = button.up('window');
        var form = win.down('form');

        //var imageprofile = form.down('multiupload#imgprofile');
       // console.log(imageprofile);
       // this.submitImageProfile(imageprofile);
        this.saveUser(button);

    },
    submitImageProfile: function(filefield) {
        var scope = this;
        console.log(filefield.getValue());

    },
    saveUser: function(button) {
        var win = button.up('window');
        var form = win.down('form');

        //verificando se todos os campos obrigatórios estão preenchidos.
        var check = false;

        var password = form.down('textfield#firstPass').value;
        var confirmpassword = form.down('textfield#confirmPasswordUser').value;
        var hiddenid = form.down('hiddenfield#hiddenid').value;
       
        // verificando se o usuário é um usuário já cadastrado no sistema.
        if(hiddenid !== ''){
            // nova senha não inserida.
            if(password === ''){
                check = true;
            } else {
                // se foi digitado uma senha nova, verificar pela confirmação.
                if(confirmpassword !== '' && password === confirmpassword){
                    check = true;
                }
            } 
        } else {
            // verificar campo de senha e de confirmação de senha
            if(password!== '' && confirmpassword!=='' &&
                    password===confirmpassword){
                check = true;
            }
        }

        if (check) {
            //verificando se os campos de nome do usuário, username, password, confirmPassword e email são validos
            if (form.down('textfield#nameUser').value !== '' &&
                    form.down('textfield#userNameUser').value !== '' &&
                    form.down('textfield#emailUser').value !== '') {
                check = true;
            }
        }

        //verificando o campo usergroup
        if (check) {
            check = false;
            if (form.down('usergroupcombobox#userGroupComboboxUser').getValue() !== null) {
                var groupTemp = form.down('usergroupcombobox#userGroupComboboxUser');
                var userGroupIndex = Ext.StoreMgr.lookup(groupTemp.store).findExact('name', groupTemp.rawValue);
                if (userGroupIndex !== -1) {
                    check = true;
                }
            }
        }

        if (check) {
            check = false;
            if (form.down('clientcombobox#clientComboboxUser').getValue() !== null) {
                var clientTemp = form.down('clientcombobox#clientComboboxUser');
                var clientIndex = Ext.StoreMgr.lookup(clientTemp.store).findExact('name', clientTemp.rawValue);
                if (clientIndex !== -1) {
                    check = true;
                }
            }
        }

        if (check) {
            var record = form.getRecord();
            var values = form.getValues();
            record.set(values);
            
            var checkState = form.down('checkbox#checkState');
            record.data.isEnabled = checkState.value;

            this.getUsersStore().add(record);
            this.getUsersStore().sync();
            this.getUsersStore().load();  
            this.getUsersList().getStore().load();            
                        
        } else {
            Ext.Msg.alert(translations.INFORMATION, translations.CHECK_ADDED_INFORMATIONS);
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
    },
    onUserDblClick: function(grid, record, item, index, e, eOpts) {
        if (record !== null) {
            this.openTitleWindowEditUser(record);
        }
    },
    openTitleWindowEditUser: function(record) {
        if (record !== null) {

            var editWindow = Ext.create('Helpdesk.view.user.Profile');
            var form = editWindow.down('form');
            form.loadRecord(record);

            //set value usergroupcombobox
            var userGroupCombo = form.down('usergroupcombobox#userGroupComboboxUser');
            var userGroupStore = userGroupCombo.store;
            userGroupStore.load();
            var userGroupIndex = Ext.StoreMgr.lookup(userGroupStore).findExact('name', record.data.userGroupName);
            var userGroupRecord = Ext.StoreMgr.lookup(userGroupStore).getAt(userGroupIndex);
            userGroupCombo.setValue(userGroupRecord);

            //set value clientcombobox
            var clientCombo = form.down('clientcombobox#clientComboboxUser');
            var clientStore = clientCombo.store;
            clientStore.load();
            var clientIndex = Ext.StoreMgr.lookup(clientStore).findExact('name', record.data.clientName);
            var clientRecord = Ext.StoreMgr.lookup(clientStore).getAt(clientIndex);
            clientCombo.setValue(clientRecord);

            var checkState = form.down('checkbox#checkState');

            if (record.get('isEnabled') === false) {
                checkState.setValue(false);
            } else {
                checkState.setValue(true);
            }

            if (record.get('picture')) { //#4
                var img = editWindow.down('image');
                img.setSrc('resources/profileImages/' + record.get('picture'));
            }
            editWindow.setTitle(record.get('name')); // #5
            editWindow.show();
        }
    }

});