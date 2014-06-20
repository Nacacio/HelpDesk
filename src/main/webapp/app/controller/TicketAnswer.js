Ext.define('Helpdesk.controller.TicketAnswer', {
    requires: ['Helpdesk.store.TicketAnswers'],
    extend: 'Ext.app.Controller',
    stores: ['TicketAnswers'],
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
    /**
     * Salva uma nova resposta para o ticket
     */
    saveNewAnswer: function(button, e, options) {
        var scope = this;
        var panel = button.up('container');
        var form = panel.up('form');
        var tktDetails = form.up();
        var panelTktAnswers = tktDetails.down('form').down('#tktAnswers');
        var txtNewAnswer = form.down('textarea#tktNewAnswer');
        if (txtNewAnswer.getValue() !== "") {
            txtNewAnswer.setLoading(translations.SAVING_REPLY);
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
                    txtNewAnswer.setLoading(false);
                    txtNewAnswer.setValue("");
                    scope.addNewAnswerInPanel(answer, panelTktAnswers);
                }
            });

        } else {
            Ext.Msg.alert(translations.INFORMATION, translations.TICKET_ANSWER_EMPTY_WARNING);
        }
    },
    addNewAnswerInPanel: function(answer, panel) {
        var resposta = Ext.create('Helpdesk.view.ticket.TicketAnswerPanel', {
            title: Helpdesk.Globals.userLogged.name
        });
        resposta.down('label#corpo').text = answer.data.description;
        panel.items.add(resposta);
        panel.doLayout();
        var answers = panel.items;
        for (var i = 0; i < answers.length; i++) {
            if (i === answers.length - 1) {
                answers.get(i).expand(true);
                answers.get(i).el.setStyle('margin','0 0 10px 0');
            } else {
                answers.get(i).collapse(true);
                answers.get(i).el.setStyle('margin','0 0 0 0');
            }
        }
    }

});

