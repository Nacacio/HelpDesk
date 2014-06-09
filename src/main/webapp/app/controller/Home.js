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
    stores: [
        'Users'
    ],
    init: function() {
        this.control({
            'mainheader': {
                afterrender: this.setButtonsAndView
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
            ref: 'mainHeader',
            selector: 'viewport mainheader'
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
    setButtonsAndView: function(form) {
        var mainHeader = this.getMainHeader();
        var btnHome = mainHeader.down("#home");
        var btnTicket = mainHeader.down("#ticket");
        var btnReports = mainHeader.down("#reports");
        if (Helpdesk.Globals.userLogged.userGroup.id !== 1) {
            btnHome.setVisible(false);
            btnTicket.setVisible(true);
            btnReports.setVisible(false);
            this.getMainHeaderSettings().setVisible(false);
            Ext.Router.redirect('ticket');
        } else {
            btnTicket.setVisible(true);
            btnHome.setVisible(true);
            btnReports.setVisible(true);
            this.getMainHeaderSettings().setVisible(true);
        }

    },
    onError: function(error) {
        this.getServerError().update(error);
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.errorview);
    },
    index: function() {
        this.getCardPanel().getLayout().setActiveItem(Helpdesk.Globals.homeview);
        var mainHeader = this.getMainHeader();
        var btnHome = mainHeader.down("#home");
        btnHome.toggle(true);
    },
    /*
     * This function controls the history router declared in app.js.
     * The funcion of this router is to check which button was clicked
     * and then redirect to the page according to the button id. The mappings
     * can be found in app.js.
     */
    onMainNavClick: function(btn) {
        if (btn.itemId === 'logout') {
            Ext.Ajax.request({
                url: 'logout',
                success: function(response) {
                    window.location.href = "../" + homeURL;
                }
            });
        }
        else {
            Ext.Router.redirect(btn.itemId);
        }
    }
});


