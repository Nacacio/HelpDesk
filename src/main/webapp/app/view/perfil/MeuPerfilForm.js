Ext.define('Helpdesk.view.perfil.MeuPerfilForm', {
    extend: 'Ext.form.Panel',  
    alias: 'widget.meuperfilform',

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
            fieldLabel: translations.NAME,
            name: 'name',
            value: Helpdesk.Globals.userLogged.name,
            width: 500
        },     
        {
            fieldLabel: translations.EMAIL,
            maxLength: 100,
            name: 'email',
            vtype: 'email',
            minLength: 0,
            value: Helpdesk.Globals.email,
            width: 500,
            padding: '10 0 20 0'
        },
        {
            xtype: "button",
            itemId: "salvarButton",
            text: translations.SAVE,
            cls: 'blue_button',
            scale: "medium",
            formBind:true
        }
    ]
});