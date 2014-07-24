Ext.define('Helpdesk.controller.TicketAnswer', {
    requires: ['Helpdesk.store.TicketAnswers'],
    extend: 'Ext.app.Controller',
    stores: ['TicketAnswers'],
    controllers: ['Ticket'],
    views: [
        'ticket.TicketDetails'
    ],
    init: function() {
        this.control({
            'button#btnSaveAnswTkt': {
                click: this.saveNewAnswer
            }
        });
    },
    refs: [
        {
            ref: 'panelTktAnswers',
            selector: 'ticketdetails > form > #tktAnswers'
        },
        {
            ref: 'ticketDetails',
            selector: 'ticketdetails'
        }
    ],
    saveNewAnswer: function(button, e, options) {
        var panel = button.up('container');
        var form = panel.up('form');
        var tktDetails = form.up();
        var multiupload = tktDetails.down('form').down('multiupload');
        this.submitValues(button, multiupload);
    },
    submitValues: function(button, multiupload) {
        var scope = this;

        var panel = button.up('container');
        var form = panel.up('form');
        var txtNewAnswer = form.down('textarea#tktNewAnswer');

        if (multiupload.filesListArchive.length > 0) {
            var time = new Date().getTime();
            var userLogadoText = Ext.DomHelper.append(Ext.getBody(), '<input type="text" name="username" value="' + Helpdesk.Globals.user + '">');
            //Criação do form para upload de arquivos
            var formId = 'fileupload-form-' + time;
            var formEl = Ext.DomHelper.append(Ext.getBody(), '<form id="' + formId + '" method="POST" action="attachments/attachments" enctype="multipart/form-data" class="x-hide-display"></form>');
            formEl.appendChild(userLogadoText);
            Ext.each(multiupload.filesListArchive, function(fileField) {
                formEl.appendChild(fileField);
            });

            var form = $("#" + formId);
            form.ajaxForm({
                beforeSend: function() {

                },
                uploadProgress: function(event, position, total, percentComplete) {
                    txtNewAnswer.setLoading(translations.UPLOADING_FILES + percentComplete + '%');
                },
                success: function() {

                },
                complete: function(xhr) {
                    var responseJSON = Ext.decode(xhr.responseText);
                    if (responseJSON.success) {
                        txtNewAnswer.setLoading(false);
                        scope.saveAnswer(button);
                    }
                    else {
                        txtNewAnswer.setLoading(false);
                        console.info("ERRO UPLOAD FILE");
                    }
                }
            });
            form.submit();

            //Clear Fields
            multiupload.filesListArchive.length = 0;
            multiupload.fileslist.length = 0;
            multiupload.doLayout();
        }
        else {
            scope.saveAnswer(button);
        }

    },
    /**
     * Salva uma nova resposta para o ticket
     */
    saveAnswer: function(button, e, options) {
        var scope = this;
        var panel = button.up('container');
        var form = panel.up('form');
        var tktDetails = form.up();
        var tela = tktDetails.up().up().up().up();
        var panelTktAnswers = tktDetails.down('form').down('#tktAnswers');
        var txtNewAnswer = form.down('textarea#tktNewAnswer');
        if (txtNewAnswer.getValue() !== "") {
            tela.setLoading(translations.SAVING_REPLY);
            var store = this.getTicketAnswersStore();
            var record = form.getRecord();
            var answer = new Helpdesk.model.TicketAnswer;
            answer.data.ticketId = record.data.id;
            answer.data.userId = Helpdesk.Globals.userLogged.id;
            answer.data.description = form.down('textarea#tktNewAnswer').getValue();
            store.add(answer);

            store.proxy.url = 'ticket-answer';
            store.sync({
                callback: function(result) {
                    store.proxy.url = 'ticket-answer';
                    tela.setLoading(false);
                    txtNewAnswer.setValue("");
                    scope.addNewAnswerInPanel(answer, panelTktAnswers);
                }
            });

        } else {
            Ext.Msg.alert(translations.INFORMATION, translations.TICKET_ANSWER_EMPTY_WARNING);
        }
    },
    addNewAnswerInPanel: function(answer, panel) {

        var scope = this;

        var answerStore = this.getTicketAnswersStore();
        answerStore.proxy.url = 'ticket-answer/find-by-ticket/' + answer.data.ticketId;
        answerStore.load({
            callback: function() {
                var answersList = new Array();
                var dateTemp = new Date(answer.data.ticket.startDate);
                dateTemp = Ext.Date.format(dateTemp, translations.FORMAT_DATE_TIME);
                panel.removeAll();

                var resposta = Ext.create('Helpdesk.view.ticket.TicketAnswerPanel', {
                    title: '<div class="div-title-answer"><p align="left">' + answer.data.ticket.user.name + '</p><p class="date-title-answer">' + dateTemp + '</p></div>'
                });
                resposta.down('label#corpo').text = answer.data.description;
                resposta.down('hiddenfield#id').text = answer.data.id;
                resposta.down('hiddenfield#idAnswer').text = 0;
                answersList[0] = resposta;
                for (i = 0; i < answerStore.getCount(); i++) {
                    var answerTemp = answerStore.data.items[i].data;
                    var name = answerTemp.user.name;
                    dateTemp = new Date(answerTemp.dateCreation);
                    var date = Ext.Date.format(dateTemp, translations.FORMAT_DATE_TIME);

                    resposta = Ext.create('Helpdesk.view.ticket.TicketAnswerPanel', {
                        title: '<div class="div-title-answer"><p align="left">' + name + '</p><p class="date-title-answer">' + date + '</p></div>'
                    });
                    resposta.down('label#corpo').text = answerTemp.description;
                    resposta.down('hiddenfield#id').text = answer.data.id;
                    resposta.down('hiddenfield#idAnswer').text = answerTemp.id;
                    answersList[answersList.length] = resposta;
                }

                var ticketView = panel.up().up();
                var ticket = answer.data.ticket;

                scope.getTicketController().resetMultiupload(ticketView);
                scope.getTicketController().formatAnswerWithFilesAndChanges(ticketView, ticket, answersList);
            }
        });
    }

});

