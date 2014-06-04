/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.view.reports.FormGraphicCategory', {
    extend: 'Ext.form.Panel',
    alias: 'widget.formgraphiccategory',
    border: 0,
    padding: 2,
    layout: {
        type: 'hbox'
    },
    items: [
        {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            border: 0,
            id: 'hboxCategory',
            margin: 0,
            items: [
                {
                    xtype: 'label',
                    padding: '9 5 5 5',
                    text: translations.TICKETS
                },
                {
                    padding: '5 5 5 5',
                    xtype: 'combobox',
                    displayField: 'name',
                    id: 'cmbTickets',
                    selected: translations.CREATED,
                    store: new Ext.data.ArrayStore({
                        extend: 'Helpdesk.store.BasicStore',
                        id: 0,
                        fields: ['id', 'name'],
                        data: [
                            [1, translations.CREATED],
                            [2, translations.CLOSEDS]
                        ]
                    }),
                    listeners: {
                        scope: this,
                        afterRender: function(me) {
                            me.setValue(translations.CREATED);
                        }
                    }
                },
                {
                    xtype: 'label',
                    padding: '9 5 5 5',
                    text: translations.FROM
                },
                {
                    padding: '5 5 5 5',
                    xtype: 'datefield',
                    id: 'dateFieldFrom',
                    listeners: {
                        scope: this,
                        afterRender: function(me) {
                            var date = new Date();
                            date.setMonth(date.getMonth() - 1);
                            me.setValue(date);
                        }
                    }
                },
                {
                    xtype: 'label',
                    padding: '9 5 5 5',
                    text: translations.TO
                },
                {
                    padding: '5 5 5 5',
                    xtype: 'datefield',
                    id: 'dateFieldTo',
                    listeners: {
                        scope: this,
                        afterRender: function(me) {
                            me.setValue(new Date());
                        }
                    }
                },
                {
                    xtype: 'label',
                    padding: '9 5 5 5',
                    text: translations.UNIT
                },
                {
                    padding: '5 5 5 5',
                    xtype: 'combobox',
                    displayField: 'name',
                    id: 'cmbUnit',
                    selected: translations.CREATED,
                    store: new Ext.data.ArrayStore({
                        extend: 'Helpdesk.store.BasicStore',
                        id: 0,
                        fields: ['id', 'name'],
                        data: [
                            [1, translations.DAY],
                            [2, translations.WEEK],
                            [3, translations.MONTH],
                            [4, translations.YEAR]
                        ]
                    }),
                    listeners: {
                        scope: this,
                        afterRender: function(me) {
                            me.setValue(translations.DAY);
                        }
                    }
                },
                {
                    xtype: 'button',
                    itemId: 'btnFind',
                    padding: '5 5 5 5',
                    text: translations.SEE
                }
            ]
        }
    ]
});

