Ext.define('Helpdesk.util.AutoComplete', {
	extend: 'Ext.form.Panel',
	alias: 'widget.autocomplete',
        border:0,
        
        items: [
        {
            xtype: 'combobox',
            id : 'autocomplete_id',
            displayField:'name',            
            valueField : 'name',            
            triggerAction: 'all',
            emptyText:'......',
            selectOnFocus:true,
            hideTrigger: true,
            queryMode: 'local',
            width: 250,
            height: 30,
            minChars:4,
            checkChangeBuffer:500,
            listeners:{
                'change': function(combobox,event,opts){
                    if(combobox !== null && combobox.lastValue !== null && combobox.lastValue.length >= 4){
                        this.getStore().load({
                            params:{
                                name:combobox.lastValue
                            }
                        });
                    }
                    else{
                        this.collapse();
                    }
                },
                'beforequery': function() {
                    if(this !== null && (this.lastValue === null || this.lastValue.length < 4)){
                        this.collapse();
                        return false;
                    }
                    return true;
                }
            }
        }],
    
        constructor: function(config)
        {    
          this.param = config.param; // get your param value from the config object
          
          var comboboxAux = this.items[0];
          comboboxAux.store = config.config.store;
          
          this.callParent(arguments);
        }

});

//requires:['Helpdesk.util.AutoComplete'],
//{
//    xtype: 'autocomplete',
//    config: { 
//        store: Ext.create('Helpdesk.store.Clients', {}),
//        labelBusca: 'name'
//    }
//}