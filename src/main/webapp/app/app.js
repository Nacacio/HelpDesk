/**
 * User: rafaelpossas
 * Date: 10/21/13
 * Time: 12:56 PM
 */

Ext.application({
    requires: [
        'Helpdesk.view.Viewport', 
        'Helpdesk.util.Util', 
        'Helpdesk.util.SessionMonitor', 
        'Helpdesk.util.Router', 
        'Helpdesk.Globals',
        'Helpdesk.proxy.Base'],
    name: 'Helpdesk',
    enableQuickTips: true,
    appProperty: 'Current',
    controllers: [
        'User', 
        'Login', 
        'Translation', 
        'Home', 
        'Ticket',
        'Settings',
        'UserGroup',
        'Client',
        'Perfil',
        'Category',
        'TicketAnswer',
        'Dashboard',
        'Priority',
        'Reports'
    ],
    enableRouter: true,
    routes: {
        '/': 'home#index',
        'ticket': 'ticket#list',
        'settings':'settings#index',
        'user': 'user#list',
        'perfil': 'perfil#index',        
        'home': 'home#index',
        'reports': 'reports#index'
    },    
    init: function() {
    },
    launch: function() {
        this.viewport = Ext.create('Helpdesk.view.Viewport');
        Helpdesk.util.SessionMonitor.start(); // Starts the session monitor
        Helpdesk.util.Router.on({
            routemissed: function(token) {
                Ext.Msg.show({
                    title: 'Error 404',
                    msg: 'Route not found: ' + token,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            },
            /**
             * For this example I'm using the dispatch event to render the view
             * based on the token. Each route points to a controller and action. 
             * Here I'm using these 2 information to get the view and render.
             * Example:
             * 
             *  users/:id/edit -> controller Users, action edit ->
             *  renders user.Edit view.
             */
            dispatch: function(token, match, params, controller) {
                /*
                var view, viewClass, action;
                target = Helpdesk.Current.viewport.down('#viewport-target'),
                        navToolbar = Helpdesk.Current.viewport.down('#main-nav-toolbar');

                // adjust controller and action names    
                action = Ext.String.capitalize(match.action);
                controller = match.controller.charAt(0).toLowerCase() + match.controller.substr(1);

                // try to get the view by controller + action names
                viewClass = Ext.ClassManager.get('Helpdesk.view.' + controller + '.' + action);

                if (viewClass) {

                    //  create view
                    view = Ext.create(viewClass, {
                        border: false
                    });

                    // clear target and add new view
                    target.removeAll();
                    target.add(view);

                    // adjust top toolbar

                }
                if (navToolbar.child('#' + controller)) {
                    navToolbar.child('#' + controller).toggle(true);
                }
                */
            }
        });
    }
});