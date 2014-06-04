/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.application({
    name: 'Helpdesk',
    enableQuickTips: true,
    appProperty: 'Current',
    controllers: [
        'Login', 'Translation'
    ],
    viewport: null,
    init: function() {
    },
    launch: function() {
        var userName = document.getElementById("user").value;
        var logged = document.getElementById("logged").value;
        var client = document.getElementById("client").value;
        if (logged === "true") {
            window.location.href = "../" + homeURL ;
        } else {
            this.viewport = Ext.create('Ext.container.Viewport', {
                layout: 'fit',
                items: [
                    {
                        xtype: 'loginview'
                    }
                ]
            });
        }


    }
});
