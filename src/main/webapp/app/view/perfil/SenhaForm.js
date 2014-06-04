/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.apply(Ext.form.VTypes, {    
    password : function(val, field) {
        if (field.initialPassField) {
            var pwd = Ext.getCmp(field.initialPassField);
            return (val === pwd.getValue());
        }
        return true;
    },
    
    passwordText : translations.PASSWORD_NOT_MATCH
});

Ext.define('Helpdesk.view.perfil.SenhaForm', {
    extend: 'Ext.form.Panel', 
    alias: 'widget.meuperfilsenhaform',
    
    layout: {
        type: 'vbox'
    },
    border: false,
    bodyPadding: 30,
    
    defaults: {
        xtype: 'textfield',
        anchor: '100%',
        allowBlank: false,        
        minLength: 3,
        msgTarget: 'under',
        labelStyle: 'font-weight:bold;padding:5px;',
        labelAlign: 'top'
        
    },
    items: [
        {
            fieldLabel: translations.PASSWORD,
            name:'password',
            inputType: 'password',
            id: 'pass',
            width: 500
        },
        {
            fieldLabel: translations.PASSWORD_CHECK, 
            name:'password_check',
            inputType: 'password',
            vtype: 'password',
            initialPassField: 'pass', // id of the initial password field
            minLength: 0,
            width:500,
            padding: '10 0 20 0'
        },
        {
            xtype: "button",
            itemId: "salvarButton",
            text: translations.SAVE,
            cls: 'blue_button',
            scale: "medium",
            formBind: true
        }
        
    ]
});