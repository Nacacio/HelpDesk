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
            cls: 'btn_anexar',
            buttonConfig: {
                iconCls: 'clip'
            },
            listeners: {
                change: function(view, value, eOpts) {
                    var parent = this.up('form');
                    parent.onFileChange(view, value, eOpts);
                }
            }

        }

    ],
    onFileChange: function(view, value, eOpts) {
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
                        click: function(me, e, eOpts) {
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
                        render: function(me, eOpts) {
                            me.setText(filename);
                        }
                    }
                }
            ]
        });

        var newUploadControl = Ext.create('Ext.form.FileUploadField', {
            buttonOnly: true,
            buttonText: translations.ATTACHMENT_FILE,
            cls: 'btn_anexar',
            buttonConfig: {
                iconCls: 'clip'
            },
            listeners: {
                change: function(view, value, eOpts) {
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
    fileValidation: function(me, filename) {

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
                title: translations.ERROR,
                msg: translations.EXTENSION_ERROR + this.extensions.join(),
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
    }    
});