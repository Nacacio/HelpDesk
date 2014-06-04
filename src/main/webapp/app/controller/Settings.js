/* 
 * @Author: rafaelpossas
 */
Ext.define('Helpdesk.controller.Settings', {
    extend: 'Ext.app.Controller',
    views: ['Helpdesk.view.settings.Settings','Helpdesk.view.user.Users','Helpdesk.view.category.Category','Helpdesk.view.client.Client'],
    init: function() {
        this.control({            
            'settingssidemenu button': {
                click: this.onSettingsMenuClick
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
            ref: 'settingsSideMenu',
            selector: 'settings > #settingssidemenu'
        },  
        {
            ref: 'usersPanel',
            selector: 'users > userslist'
        },        
        {
            ref: 'categoryPanel',
            selector: 'category > categorygrid'
        },        
        {
            ref: 'clientPanel',
            selector: 'client > clientgrid'
        },
        {
            ref: 'priorityPanel',
            selector: 'priority > prioritygrid'
        }
    ],
    index: function() {
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.settingsview);
        this.getSettingsCardPanel().getLayout().setActiveItem(Helpdesk.Globals.settings_users_view);
        this.getUsers();
    },
    onSettingsMenuClick: function(btn){
        if(btn.itemId==='user'){
            this.getSettingsCardPanel().getLayout().setActiveItem(Helpdesk.Globals.settings_users_view);
            this.getUsers();
        }
        else if(btn.itemId==='category')
        {
            this.getSettingsCardPanel().getLayout().setActiveItem(Helpdesk.Globals.settings_category_view);
            this.getCategory();
        }
        else if(btn.itemId==='client')
        {
            this.getSettingsCardPanel().getLayout().setActiveItem(Helpdesk.Globals.settings_client_view);
            this.getClient();
        }
        else if(btn.itemId==='priority')
        {
            this.getSettingsCardPanel().getLayout().setActiveItem(Helpdesk.Globals.settings_priority_view);
            this.getPriority();
        }
    },
    
    getUsers: function(){
        this.getUsersPanel().getStore().load();
        this.setPressedButton('user');
    },
    getCategory: function(){
        this.getCategoryPanel().getStore().load();
        this.setPressedButton('category');
    },
    getClient: function(){
        this.getClientPanel().getStore().load();
        this.setPressedButton('client');
    },
    getPriority: function(){
        this.getPriorityPanel().getStore().load();
        this.setPressedButton('priority');
    },
    setPressedButton:function(buttonID){
        var buttons = this.getSettingsSideMenu().items.items;
        for (var i = 0; i < buttons.length-1; i++) {
            if(buttonID === buttons[i].itemId){
                buttons[i].toggle(true);                
            }
            else{
                buttons[i].toggle(false);
            }   
        }
    }
    
    
});
