Ext.define('Helpdesk.controller.TicketAnswer', {
    requires:['Helpdesk.store.TicketAnswers'],
    extend: 'Ext.app.Controller',
    stores: ['TicketAnswers'],
    views:[
        'ticket.TicketDetails'
    ],
    init: function() {
        this.control({            
            'button#btnSaveAnswTkt':{
                click: this.saveNewAnswer
            }            
         });
    },
    refs: [

    ],
    
    /**
     * Salva uma nova resposta para o ticket
     */
    saveNewAnswer:function(button, e, options){       
        var panel = button.up('container');
        var form = panel.up('form');   
        
        if(form.down('textarea#tktNewAnswer').getValue()!==""){            
            
            var store = this.getTicketAnswersStore();               
            var record = form.getRecord();
            var answer = new Helpdesk.model.TicketAnswer;            
            answer.data.ticketId = record.data.id;            
            answer.data.userId = record.data.user.id;
            answer.data.description = form.down('textarea#tktNewAnswer').getValue();
            store.add(answer);
            
            store.proxy.url='ticket-answer';
            store.sync({
                callback:function(){
                    store.proxy.url='ticket-answer';
                }
        })       
            //console.log(form.down('textarea#tktNewAnswer').getValue());
        }else{
            Ext.Msg.alert(translations.INFORMATION,translations.TICKET_ANSWER_EMPTY_WARNING)
        }
        
    },
    

    
});