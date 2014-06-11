/* File Created: June 14, 2013 */
/* Author : Sebastian 
 * Modifications: André Nacacio*/
Ext.define("Helpdesk.util.MultiUpload", {
    extend: 'Ext.form.Panel',
    border: 0,
    alias: 'widget.multiupload',
    margins: '2 2 2 2',
    accept: ['pdf', 'jpg', 'png', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'bmp', 'tif', 'zip', 'rar',
             'PDF', 'JPG', 'PNG', 'GIF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'BMP', 'TIF', 'ZIP', 'RAR'],
    extensions: ['pdf', 'jpg', 'png', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'bmp', 'tif', 'zip', 'rar'],
         
    fileslist: [],
    filesListArchive: [],
    frame: false,
    ticketId: 0,
    items: [
        {
            xtype: 'filefield',
            buttonOnly: true,
            buttonText: translations.ATTACHMENT_FILE,
            cls:'btn_anexar',
            buttonConfig: {
                iconCls: 'clip'
            },
            listeners: {
                change: function (view, value, eOpts) {                   
                    var parent = this.up('form');
                    parent.onFileChange(view, value, eOpts);
                }
            }

        }

    ],
    onFileChange: function (view, value, eOpts) {
        var fileNameIndex = value.lastIndexOf("/") + 1;
        if (fileNameIndex === 0) {
            fileNameIndex = value.lastIndexOf("\\") + 1;
        }
        var filename = value.substr(fileNameIndex);

        var IsValid = this.fileValidation(view, filename);
        if (!IsValid) {
            return;
        }

        this.filesListArchive.push(view.extractFileInput());
        this.fileslist.push(filename);
        var addedFilePanel = Ext.create('Ext.form.Panel', {
            frame: false,
            border: 0,
            padding: 2,
            margin: '0 10 0 0',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [

                {
                    xtype: 'button',
                    text: null,
                    border: 0,
                    frame: false,
                    iconCls: 'delete_16',
                    tooltip: translations.DELETE,
                    listeners: {
                        click: function (me, e, eOpts) {
                            var currentform = me.up('form');
                            var mainform = currentform.up('form');
                            var lbl = currentform.down('label');
                            var filefieldselect = currentform.down('filefield');
                            mainform.filesListArchive.pop(filefieldselect);
                            mainform.fileslist.pop(lbl.text);
                            mainform.remove(currentform);
                            currentform.destroy();
                            mainform.doLayout();
                        }
                    }
                },
                {
                    xtype: 'label',
                    padding: 5,
                    listeners: {
                        render: function (me, eOpts) {
                            me.setText(filename);
                        }
                    }
                }
            ]
        });

        var newUploadControl = Ext.create('Ext.form.FileUploadField', {                  
            buttonOnly: true,
            buttonText: translations.ATTACHMENT_FILE,
            cls:'btn_anexar',
            buttonConfig: {
                iconCls: 'clip'
            },
            listeners: {
                change: function (view, value, eOpts) {
                    //  alert(value);
                    var parent = this.up('form');
                    parent.onFileChange(view, value, eOpts);
                }
            }
        });
        view.hide();
        addedFilePanel.add(view);
        this.insert(0, newUploadControl);
        this.add(addedFilePanel);
    },

    fileValidation: function (me, filename) {

        var isValid = true;
        var indexofPeriod = me.getValue().lastIndexOf("."),
            uploadedExtension = me.getValue().substr(indexofPeriod + 1, me.getValue().length - indexofPeriod);
        if (!Ext.Array.contains(this.accept, uploadedExtension)) {
            isValid = false;
            // Add the tooltip below to 
            // the red exclamation point on the form field
            me.setActiveError(translations.EXTENSION_ERROR + this.extensions.join());
            // Let the user know why the field is red and blank!
            Ext.MessageBox.show({
                title:translations.ERROR,
                msg:  translations.EXTENSION_ERROR + this.extensions.join(),
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
            // Set the raw value to null so that the extjs form submit
            // isValid() method will stop submission.
            me.setRawValue(null);
            me.reset();
        }

        if (Ext.Array.contains(this.fileslist, filename)) {
            isValid = false;
            me.setActiveError(translations.THE_FILE + filename + translations.ALREADY_ADDED);
            Ext.MessageBox.show({
                title: translations.ERROR,
                msg: translations.THE_FILE + filename + translations.ALREADY_ADDED,
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.ERROR
            });
            // Set the raw value to null so that the extjs form submit
            // isValid() method will stop submission.
            me.setRawValue(null);
            me.reset();
        }


        return isValid;
    },
    
    submitValues:function(){
        if(this.filesListArchive.length > 0){     
            var time = new Date().getTime();
            var formId = 'fileupload-form-' + time;
            var formEl = Ext.DomHelper.append(Ext.getBody(), '<form id="' + formId + '" method="POST" action="ticket/'+this.ticketId+'/files" enctype="multipart/form-data" class="x-hide-display"></form>');

            Ext.each(this.filesListArchive, function(fileField) {
                formEl.appendChild(fileField);
            }); 
//            Ext.Ajax.request({
//                url: 'ticket/'+this.ticketId+'/files',
//                isUpload: true,
//                method: 'POST',
//                form: formEl,
//                scope: this
//             });
//            var form = $('#'+formId).ajaxForm({ 
//                beforeSubmit: function() {
//                    console.log("befor");
//                    var url = form[0].action;
//                    var pos = url.indexOf(";"); 
//                    if (pos !== -1){ 
//                        url = url.substring(0, pos); 
//                    }  
//                    // Start a simple clock task that updates a div once per second
////                    var task = {
////                        run: function(){
////                            console.log("interval");
////                            $.get(url + ".progress", function(data) {
////                                console.log("ok");
////                                if (!data) return;
////                                data = data.split("/");                        
////                                console.log(Math.round(data[0] / data[1] * 100) * 2 ); 
////                            }); 
////                        },
////                        interval: 1000 //1 second
////                    }                   
////                    var runner = new Ext.util.TaskRunner();
////                    runner.start(task); 
//                    $.get(url + ".progress", function(data) {
//                        console.log("ok");
//                        if (!data) return;
//                        data = data.split("/");                        
//                        console.log(Math.round(data[0] / data[1] * 100) * 2 ); 
//                    });
//                    
//                
////                    time = Ext.tim(function() {  
////                        console.log("interval");
////                        $.get(url + ".progress", function(data) {
////                            if (!data) return;
////                            data = data.split("/");                        
////                            console.log(Math.round(data[0] / data[1] * 100) * 2 ); 
////                        },function(data){
////                            console.log("ERRO");
////                        }); 
////                    }, 500); 
//                }, 
//                success: function() {
//                    clearInterval(time);  
//                    //elem.width(100 * 2); 
//                }
//            });
//            form.submit();
            
            Ext.define('myAjax', {
                extend: 'Ext.data.Connection',
                singleton: true,
                constructor : function(config){
                    this.callParent([config]);
                    this.on("beforerequest", function(conn, options, eOpts){
                        console.info("beforerequest");
                        var url = options.url;                   
                        var pos = url.indexOf(";"); 
                        if (pos != -1) url = url.substring(0, pos); 
                        
                        time = setInterval(function() {
                            $.get(url + ".progress", function(data) {
                                if (!data) return;
                                data = data.split("/");
                                
                                console.warn(Math.round(data[0] / data[1] * 100) * 2 ); 
                            }); 
                        }, 500); 
                    });
                    this.on("requestcomplete", function(){
                        console.info("requestcomplete");
                    });
                }
            });
            
            
            myAjax.request({
                url: 'ticket/'+this.ticketId+'/files',
                isUpload: true,
                method: 'POST',
                form: formEl,
                scope: this                    
             });

          
            //Clear Fields
            this.filesListArchive.length = 0;
            this.fileslist.length = 0;
            
            for (var i = 1; i< this.items.items.length;i++){
                this.items.items[i].destroy();
            }
            this.doLayout();
        }
        
    }
});