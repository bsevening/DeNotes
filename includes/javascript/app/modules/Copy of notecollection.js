define([
  "namespace",
  'use!underscore', 
  'use!backbone',  
  'modules/notemodel'
  ], function(namespace, _, Backbone, NoteModel){
  	
	var NoteCollection = namespace.module();
	  
	NoteCollection.Collection = Backbone.Collection.extend({ 

	    // Reference to this collection's model.
	    model: NoteModel.Model,
		
		initialize: function(options) {
            options || (options = {});
            this.userid = options.userid;
			//_.bindAll(this, 'url');
        },
		
		url: function () {
            return 'http://servermachine.bsevening.com/DeNotes/index.cfm/note/' + this.userid;
        },
		
		parse: function(response) {
			return response.data;
	  	},
	
	  });
  return NoteCollection;
});
