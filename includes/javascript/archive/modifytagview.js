define([
  "namespace",

  // Libs
  "jquery",
  "use!underscore",
  "use!backbone",
  "views/tagview",

  // Modules
  "aura/mediator"

  // Plugins
],

function(namespace, $, _, Backbone, TagView, mediator) {

  // Create a new module
  var ModifyTagView = namespace.module();
  
  // Shorthand the application namespace
  var app = namespace.app;

  // This will fetch the tutorial template and render it.
  ModifyTagView.Views.ModifyTagView = TagView.Views.TagView.extend({
    template: "includes/javascript/app/templates/modifytagtemplate.html",	
	
	initialize: function(options) {
		options || (options = {});
    	_.bindAll(this, 'render', 'close', 'renameTag');
    	
		this.model.on("change:tagname", this.render);
		this.collection = options.collection;
		this.model = options.model;
		this.noteModel = options.noteModel;
		this.model.on("destroy", this.close, this);
    },
	
	events:{
		"click #removeTag": "destroy",
		"click .renameTag": "renameTag"
	},
	
	destroy: function(e){
		var view = this;
        view.model.destroy({
            success: function(){
            	mediator.publish('removeTags');
				mediator.publish('showTags');
            },
            error: function(){
                alert("Error while removing tag.")
            }
        });
	},
	
	renameTag: function(e){
		var view = this;
		var templateHTML = "includes/javascript/app/templates/tagedittemplate.html";
		var tagEditDialog = $("#tagEditDialog").dialog({
	        autoOpen: false,
	        modal: true,
			width: "250px",
	        position: [e.clientX, e.clientY],
	        open: function(){
	           namespace.fetchTemplate(templateHTML, function(tmpl) {
				$("#tagEditDialog.ui-dialog-content").html(tmpl(view.model.toJSON()));
			   });
	        },
			buttons: {
				"Save": function(){
					var dialog = this;
					var newTagName = $(dialog).find("#tageditname").val();
					view.model.set("tagname", newTagName);
	                view.model.save({}, {
						success: function() {
							$(dialog).dialog("destroy");	
						},
	                    error: function(){
	                        alert("Error while renaming tag.")
	                    }
	                });						
				},
				"Cancel": function(){
					$(this).dialog("destroy");
				}
			}
	    });
	    $(tagEditDialog).dialog('open');
	}
	
  });

  // Required, return the module for AMD compliance
  return ModifyTagView;

});