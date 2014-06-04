/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.controller.Translation', {
    extend: 'Ext.app.Controller',
    views: [
        'Translation' // #1
    ],
    refs: [
        {
            ref: 'translation', // #2
            selector: 'translation'
        }
    ],
    init: function(application) {
        this.control({
            "translation menuitem": {// #3
                click: this.onMenuitemClick
            },
            "translation": {// #4
                beforerender: this.onSplitbuttonBeforeRender
            }
        });
    },
    onSplitbuttonBeforeRender: function(abstractcomponent, options) {
        var lang = localStorage ? (localStorage.getItem('user-lang') || 'pt_BR') : 'pt_BR'; // #5”
        abstractcomponent.iconCls = lang; // #6
        if (lang === 'en') { // #7
            abstractcomponent.text = 'English'; // #8
        } else if (lang === 'es') {
            abstractcomponent.text = 'Español';
        } else {
            abstractcomponent.text = 'Português';
        }
    },
    onMenuitemClick: function(item, e, options) {
        var menu = this.getTranslation(); // #9

        menu.setIconCls(item.iconCls); // #10
        menu.setText(item.text);       // #11

        localStorage.setItem("user-lang", item.iconCls); // #12

        window.location.reload(); // #13
    }
});

