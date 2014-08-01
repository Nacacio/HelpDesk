/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.user.UserForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.userform',
    id: 'userForm',
    requires: ['Helpdesk.util.Util', 'Helpdesk.view.user.UserGroupComboBox','Helpdesk.view.client.ClientComboBox'],
    bodyPadding: 5,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'fieldset',
            flex: 2,
            title: translations.USER,
            defaults: {
                beforeLabelTextTpl: Helpdesk.util.Util.required,
                anchor: '100%',
                xtype: 'textfield',
                allowBlank: false,
                labelWidth: 60
            },
            items: [
                {
                    xtype: 'hiddenfield',
                    fieldLabel: translations.ID,
                    name: 'id',
                    id: 'hiddenid'
                },
                {
                    xtype: 'hiddenfield',
                    id: 'hiddenpassword'
                },
                {
                    fieldLabel: translations.NAME,
                    maxLength: 100,
                    id: 'nameUser',
                    name: 'name'
                },
                {
                    fieldLabel: translations.USER,
                    id: 'userNameUser',
                    name: 'userName'
                },
                {
                    inputType: 'password',
                    fieldLabel: translations.PASSWORD,
                    id: 'firstPass',
                    name: 'password'
                },                
                {
                    id: 'confirmPasswordUser',
                    inputType: 'password',
                    fieldLabel: translations.PASSWORD_CHECK,
                    labelWidth: 110,
                    vtype: 'password',
                    name: 'confirmPassword',
                    initialPassField: 'firstPass'
                },
                {
                    fieldLabel: translations.EMAIL,
                    maxLength: 100,
                    id: 'emailUser',
                    name: 'email'
                },
                {
                    xtype: 'usergroupcombobox',
                    id: 'userGroupComboboxUser',
                    listeners: {
                        select: function(combo, records, eOpts) {
                            var form = this.up('form');
                            var record = form.getRecord();
                            var userGroup = Helpdesk.util.Util.copy(records[0]);
                            record.set('userGroup', userGroup);
                            form.updateRecord(record);
                        }
                    }

                },
                {
                    xtype: 'clientcombobox',
                    id: 'clientComboboxUser',
                    listeners: {
                        select: function(combo, records, eOpts) {
                            var form = this.up('form');
                            var record = form.getRecord();
                            var client = Helpdesk.util.Util.copy(records[0]);
                            record.set('client', client);
                            form.updateRecord(record);
                        }
                    }

                },
                {                    
                    xtype: 'checkbox',
                    fieldLabel: translations.ACTIVE,                    
                    beforeLabelTextTpl: '',
                    id: 'checkState'
                },
                {
                    xtype: 'filefield',
                    id: 'imgprofile',
                    fieldLabel: translations.PICTURE,
                    emptyText: translations.SELECT_A_PROFILE_PICTURE,
                    name: 'picture',
                    buttonText: translations.BROWSE,
                    allowBlank: true,
                    beforeLabelTextTpl: '',
                    listeners: {
                        change: function(view, value, eOpts) {
                            var parent = this.up('form');
                            parent.onFileChange(view, value, eOpts);
                        }
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: translations.PICTURE,
            width: 170, // #1
            items: [
                {
                    xtype: 'image', // #2
                    width: 150,
                    height: 200,
                    src: ''         // #3
                }
            ]
        }
    ],
    onFileChange: function(view, value, eOpts) {
        var fileNameIndex = value.lastIndexOf("/") + 1;
        if (fileNameIndex === 0) {
            fileNameIndex = value.lastIndexOf("\\") + 1;
        }
        var filename = value.substr(fileNameIndex);

        var IsValid = this.fileValidation(view, filename);
        if (!IsValid) {
            return;
        }
    }

});
