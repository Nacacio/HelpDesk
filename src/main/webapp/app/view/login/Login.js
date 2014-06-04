/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.login.Login', {
    extend: 'Ext.container.Container',
    requires: ['Helpdesk.view.Translation','Helpdesk.view.login.LoginForm','Helpdesk.view.login.CapsLockTooltip','Helpdesk.view.login.SignInForm','Helpdesk.proxy.Base'],
    alias: 'widget.loginview',
    layout: 'border',
    items: [
        {
            xtype: 'panel',
            region: 'north',
            height: 40,
            bodyCls: 'loginDockbar'
        },
        {
            xtype: 'panel',
            itemId: 'centerregion',
            region: 'center',
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'start'
            },
            items: [
                {
                    xtype: 'tbfill'
                },
                {
                    border: 0,
                    padding: '0 15 0 15',
                    width: 470,
                    layout: {
                        type: 'vbox',
                        pack: 'start'

                    },
                    items: [
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype: "image",
                            src: homeURL + translations.PROCYMO_LOGO,
                            border: 0,
                            padding: "0 0 15 0",
                            height: 80
                        },
                        {
                            xtype: "displayfield",
                            value: translations.WELCOME_TEXT,
                            fieldCls: 'font_color_black_large',
                            border: 0,
                            padding: "0 0 15 0",
                            width: "100%",
                            height: 100
                        },
                        {
                            xtype: "displayfield",
                            fieldCls: 'font_color_gray_bold_large',
                            border: 0,
                            value: translations.FIRST_TIME_REQUESTING_SERVICE,
                            height: 40
                        },
                        {
                            layout: "hbox",
                            border: 0,
                            items: [
                                {
                                    xtype: "button",
                                    itemId: "signIn",
                                    text: translations.SIGN_IN,
                                    cls: 'blue_button',
                                    scale: "medium"

                                },
                                {
                                    xtype: "displayfield",
                                    value: translations.AND_REQUEST_SERVICE,
                                    padding: "0 0 0 5",
                                    fieldCls: 'font_color_gray_bold_large'
                                }
                            ],
                            height: 100
                        },
                        {
                            xtype:  'tbfill'
                        }
                    ]
                },
                {
                    border: 0,
                    width: 470,
                    padding: '0 15 0 15',
                    layout: {
                        type: 'vbox',
                        pack: 'start'

                    },
                    items: [
                        {
                            xtype: 'tbfill'
                        },
                        {
                            xtype: "loginform"
                        },
                        {
                            xtype: 'tbfill'
                        }
                    ]
                },
                {
                    xtype:  'tbfill'
                }
            ]
        },
        {
            xtype: 'panel',
            region: 'south',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'center'
            },
            bodyCls: 'loginDockbar',
            height: 40,
            items: [
                {
                    xtype: 'displayfield',
                    value: translations.CYMO_TECNOLOGIA,
                    fieldCls: 'font_color_white_small'
                }
            ]
        }
    ]
});



