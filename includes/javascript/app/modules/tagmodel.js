define(["namespace", 'use!underscore', 'use!backbone',  "aura/mediator"], function(namespace, _, Backbone, mediator){
    var TagModel = namespace.module();
    // Shorthand the application namespace
    var app = namespace.app;
    
    TagModel.Model = Backbone.Model.extend({
		
		defaults: {
		  tagcount: 0,
		  noteid: ""
		},
    
        url: function(){
            // Important! It's got to know where to send its REST calls.
            // In this case, POST to '/Tag' and PUT to '/Tag/:id/userid'
            //return this.id ? '/tags/' + this.id : '/tags';
			if (this.isNew())
				return 'http://servermachine.bsevening.com/DeNotes/index.cfm/Tag/' + this.get('userid');
			else
				return 'http://servermachine.bsevening.com/DeNotes/index.cfm/Tag/' + this.get('id') + '/' + this.get('userid');
        }
        
    });
    return TagModel;
});
