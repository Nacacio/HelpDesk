/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.user.UserForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.userform',
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
                    fieldLabel: translations.IS_ENABLE,
                    name: 'isEnabled'
                },
                {
                    fieldLabel: translations.NAME,
                    maxLength: 100,
                    name: 'name'
                },
                {
                    fieldLabel: translations.USER,
                    name: 'userName'
                },
                {
                    fieldLabel: translations.PASSWORD,
                    name: 'password'
                },
                {
                    fieldLabel: translations.EMAIL,
                    maxLength: 100,
                    name: 'email'
                },
                {
                    xtype: 'usergroupcombobox',
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
