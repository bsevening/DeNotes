define([
  "namespace",
  'jquery', 
  'use!underscore', 
  'use!backbone',
  'views/basetagview',
  'aura/mediator',
  'baseview'
  
  
  ], function(namespace, $, _, Backbone, BaseTagView, mediator, BaseView){
   
   var CheckTagGroup = namespace.module();
   
   CheckTagGroup.Views.CheckTagGroupView = BaseView.extend({
    template: "includes/javascript/app/templates/checktagsgrouptemplate.html",
	tagName: 'div',
    className: 'checktag-9',
	id: "tagview",

    initialize: function(options) {
	  options || (options = {});
      _.bindAll(this, 'render', 'close', 'addTag');
      //this.collection.bind('reset', this.render);
	  this.collection = options.collection;
	  this.noteModel = options.noteModel;	 
    },
	
	events: {
		"click #buttontag": "addTag"
    },

    render: function(done) {
	  var that = this;
      // Fetch the template, render it to the View element and call done.
      namespace.fetchTemplate(this.template, function(tmpl) {
		 $(that.el).append(tmpl());		
      });
      return this;
    },
	
	addTag: function(e) {
		e.preventDefault();
		var that = this;
		//var newTag = $(".tagname").children('form').serializeObject();
		var newTag = {tagname:$("#TagName").val(), userid: this.collection.userid};
		that.collection.create(newTag, { wait: true });
	},	
	
	close: function() {
		this.dispose();
	},

    // Remove the item, destroy the model.
    clear: function() {
      this.model.clear();
    }

  });
  
   // This will fetch the tutorial template and render it.
  CheckTagGroup.Views.CheckTagView = BaseTagView.extend({
    template: "includes/javascript/app/templates/checktagtemplate.html",
	
	initialize: function(options) {
		options || (options = {});
    	_.bindAll(this, 'render', 'close'); 
		this.collection = options.collection;
		this.model = options.model;
		this.noteModel = options.noteModel;
    }	
	
  });
  
  return CheckTagGroup;
});
