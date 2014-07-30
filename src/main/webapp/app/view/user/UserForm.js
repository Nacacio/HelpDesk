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
                    name: 'id'
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
                    fieldLabel: translations.PICTURE,
                    name: 'picture',
                    allowBlank: true,
                    beforeLabelTextTpl: ''
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
                    height: 180,
                    width: 150,
                    src: ''         // #3
                }
            ]
        }
    ]

});
