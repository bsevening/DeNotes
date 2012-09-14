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
  var TagCountView = namespace.module();
  
  // Shorthand the application namespace
  var app = namespace.app;

  // This will fetch the tutorial template and render it.
  TagCountView.Views.TagCountView = TagView.extend({
    template: "includes/javascript/app/templates/tagtemplate.html",
	
	initialize: function() {
    	_.bindAll(this, 'render', 'close', 'resetCollection'); 
    },
	
	events: {
		"click .tag-content"        : "resetCollection"
    },
	
	
	// Reload collection for a specific tag.
    resetCollection: function() {
	  mediator.publish('removeModifyTags');
      var tag = this.model.get("id");
	  mediator.publish('resetNotes', tag); // sub in note controller 
    },
	
  });

  // Required, return the module for AMD compliance
  return TagCountView;

});