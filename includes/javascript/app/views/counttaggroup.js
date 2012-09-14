define([
  "namespace",
  'jquery', 
  'use!underscore', 
  'use!backbone',
  "views/basetagview",
  'baseview',
  'aura/mediator'
  
  
  ], function(namespace, $, _, Backbone, BaseTagView, BaseView, mediator){
   
   var CountTagGroup = namespace.module();
   
   // Shorthand the application namespace
   var app = namespace.app;
   
   CountTagGroup.Views.CountTagGroupView = BaseView.extend({
     template: "includes/javascript/app/templates/tagsgrouptemplate.html",
	  tagName: 'div',
    className: 'box shadow round-corners height-9',
	       id: "tagview",

    initialize: function(options) {
	  options || (options = {});
	  this.tagController = app.tagController;
	  this.collection = options.collection;
      _.bindAll(this, 'render', 'close', 'manageTags');
      //this.collection.bind('reset', this.render);
	  this.bindTo(this.collection, 'reset', this.render);

    },
	
	events: {
		"click div#managetags": "manageTags"
    },

    render: function(done) {
	  var that = this;
      // Fetch the template, render it to the View element and call done.
      namespace.fetchTemplate(this.template, function(tmpl) {
		 $(that.el).append(tmpl());		
		 that.tagController.showCountTags(that);
      });
      return this;
    },
	
	manageTags: function(e) {
		var that = this;		
		// Not sure which view is current so we just remove both. Easier than trying to keep track.
		// Remove notes group along with children, call is in note controller.
		app.noteRouter.navigate("#manageTags", {trigger: true});
	},
	
	close: function() {
		this.dispose();
	}

  });
  
  CountTagGroup.Views.CountTagView = BaseTagView.extend({
    template: "includes/javascript/app/templates/tagtemplate.html",
	
	initialize: function(options) {
		options || (options = {});
    	_.bindAll(this, 'render', 'close', 'resetCollection');
		this.tagController = app.tagController;
		this.model = options.model; 
    },
	
	events: {
		"click .tag-content": "resetCollection"
    },
	
	
	// Reload collection for a specific tag.
    resetCollection: function(e) {
		var that = this;
		var tagID = that.model.get("id");
		$(".tag-content").removeClass("red_selected");
		$(e.target).addClass("red_selected");
	  	that.tagController.removeModifyTags();
		app.noteRouter.navigate("#tagGroup/"+tagID, {trigger: true});      	
	  	//mediator.publish('resetNotes', tag); // sub in note controller 
    },
	
  });
  
  return CountTagGroup;
});
