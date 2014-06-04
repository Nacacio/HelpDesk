/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.util.Util', {
    constructor: function(config) {
        this.initConfig(config);
    },
    statics: {
        required: '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
        showErrorMsg: function(text) {

            Ext.Msg.show({
                title: 'Error!',
                msg: text,
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            });
        },
        copy: function(extjsmodel) {
            var responseObject = {};
            for (var prop in extjsmodel.data) {
                responseObject[prop] = extjsmodel.data[prop];
            }
            return responseObject;
        }

    }
});