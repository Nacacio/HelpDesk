/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.store.BasicStore', {
    extend: 'Ext.data.Store',
    autoload: false,
    constructor: function(config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: this.createProxy()
        });
        this.callParent([config]);
    },
    createProxy: function() {
        var storeScope = this;
        return {
            type: 'rest',
            noCache: true,
            limitParam: undefined,
            pageParam: undefined,
            startParam: undefined,
            reader: {
                type: 'json'
            },
            listeners: {
                scope: storeScope,
                exception: function(proxy, response, options) {
                    this.exceptionHandling(proxy, response);
                }
            }
        };
    },
    exceptionHandling: function(proxy, response) {
        if (response && proxy) {
            try {
                var responseData = proxy.reader.getResponseData(response);
                if (responseData.message) {
                    var messageDescription = 'Information'; // title of the alert box
                    var messageIcon = Ext.MessageBox.INFO;

                    if (!responseData.success)
                    {
                        var messageDescription = 'Error';
                        var messageIcon = Ext.MessageBox.ERROR;
                    }

                    Ext.MessageBox.show({
                        title: messageDescription,
                        msg: responseData.message,
                        buttons: Ext.MessageBox.OK,
                        icon: messageIcon
                    });
                }
            }
            catch (err) {
                // Malformed response most likely
                console.log(err);
            }
        }
    }

});

