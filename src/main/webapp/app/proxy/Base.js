/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.proxy.Base', {
    extend: 'Ext.data.proxy.Rest',
    alias: 'proxy.base',
    type: 'rest',
    noCache: false,
    limitParam: undefined,
    pageParam: undefined,
    startParam: undefined,
    autoLoad: false,
    autoSync: false,
    headers: {'Content-Type': 'application/json'},
    reader: {
        type: 'json'
    },
    writer:{
        type: 'json',
        writeAllFields: true
    },
    listeners: {
        exception: function(proxy, response, operation) {
            if (response && proxy) {

                var bodyHtml = /<body.*?>([\s\S]*)<\/body>/.exec(response.responseText)[1];
                Helpdesk.Current.fireEvent('servererror', bodyHtml);
                /*
                 try {
                 var responseData = proxy.reader.getResponseData(response);
                 console.log(response);
                 console.log(responseData);
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
                 */
            }
        }
    }
});