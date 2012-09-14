define(["namespace", 'use!underscore', 'use!backbone'], function(namespace, _, Backbone){
    var NoteModel = namespace.module();
    // Shorthand the application namespace
    var app = namespace.app;
    
    NoteModel.Model = Backbone.Model.extend({
		
		initialize: function(options) {
            options || (options = {});
            this.userid = options.userid;
        },
		
		url: function(){
            // Important! It's got to know where to send its REST calls.
            // In this case, POST to '/notes' and PUT to '/notes/:id'
			if (this.isNew())
            	return 'http://servermachine.bsevening.com/DeNotes/index.cfm/Note'
			else
				return 'http://servermachine.bsevening.com/DeNotes/index.cfm/Note/' + this.get("id");
        },
		
		defaults: {
		  notetags: [],
		  note: "",
		  title: ""
		},
		
		parse: function(response) {
			if (response.Note) {
				return response.Note;
			}
			else {
				return response;
			}
	  	},
        
        // Remove this note from db.
        clearNote: function(){
            this.destroy({
				wait: true,                
                error: function(){
                    alert("Error occurred trying to remove from server?!");
                }
			});
        }
        
    });
    return NoteModel;
});
