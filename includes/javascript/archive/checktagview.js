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
  var CheckTagView = namespace.module();
  
  // Shorthand the application namespace
  var app = namespace.app;

  // This will fetch the tutorial template and render it.
  CheckTagView.Views.CheckTagView = TagView.extend({
    template: "includes/javascript/app/templates/checktagtemplate.html",
	
	initialize: function(options) {
		options || (options = {});
    	_.bindAll(this, 'render', 'close'); 
		this.collection = options.collection;
		this.model = options.model;
		this.noteModel = options.noteModel;
    }	
	
  });

  // Required, return the module for AMD compliance
  return CheckTagView;

});