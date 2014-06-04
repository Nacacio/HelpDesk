/* 
 * @Author rafaelpossas
 * 
 * Controller responsible for taking care of the main header. Listeners are attached
 * to the tab bar buttons and are responsible for changing the views of the card layout
 * in the viewport.
 * 
 * Views:
 *    view/home/Home.js
 *    view/home/MainHeader.js
 */
Ext.define('Helpdesk.controller.Home', {
    extend: 'Ext.app.Controller',
    views: ['home.Home'],
    stores:[
        'Users'
    ],
    init: function() {
        this.control({
            
            'mainheader':{
                afterrender:this.setButtonsAndView
            },
            'mainheader button': {                                                
                click: this.onMainNavClick
            }
        });
        this.application.on({
            servererror: this.onError,
            scope: this
        });
    },
    /*
     * Creates a reference for the Panel with card layout,
     * this way we can change the views when the user clicks
     * on the main header buttons.
     *
     */
    refs: [
        {
            ref: 'cardPanel',
            selector: 'viewport > container#maincardpanel'
        },
        {
            ref: 'serverError',
            selector: 'servererror > #errorPanel'
        },
        {
            ref: 'mainHeaderSettings',
            selector: '#settings'
        }
    ],
    
    setButtonsAndView:function(form){
        var store = new Helpdesk.store.Users();      
        store.proxy.url='user/'+Helpdesk.Globals.user;
        store.load({
            callback:function(){
                
                if(store.data.items[0].data.userGroup.id === 1){
                    form.down('button#home').toggle(true);
                    form.down('button#ticket').toggle(false);
                    form.down('button#home').setVisible(true);
                    
                }else{
                    form.down('button#home').toggle(false);
                    form.down('button#ticket').toggle(true);
                    form.down('button#home').setVisible(false);
                    Ext.Router.redirect('ticket');                   
                }                
                store.proxy.url='user';
                store.load();
            }
        });
        
    },    
    onError: function(error){
        this.getServerError().update(error);
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.errorview);
    },
    index: function() {
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.homeview);
        if(Helpdesk.Globals.userLogged.userGroup.id === 1){
            this.getMainHeaderSettings().setVisible(true);
        }
        else{
            this.getMainHeaderSettings().setVisible(false);
        }
      
    },
    /*
     * This function controls the history router declared in app.js.
     * The funcion of this router is to check which button was clicked
     * and then redirect to the page according to the button id. The mappings
     * can be found in app.js.
     */
    onMainNavClick: function(btn) {            
        if(btn.itemId === 'logout'){
            Ext.Ajax.request({
                url: 'logout',
                success: function(response) {
                    window.location.href = "../" + homeURL;
                }
            });
        }
        else{
            Ext.Router.redirect(btn.itemId);
        }
    }
});


