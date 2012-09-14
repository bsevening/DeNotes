define([
  "namespace",
  'jquery', 
  'use!underscore', 
  'use!backbone',
  'baseview',
  'views/basetagview',
  'aura/mediator'
  
  
  
  ], function(namespace, $, _, Backbone, BaseView, BaseTagView, mediator){
   
   var ModifyTagGroup = namespace.module();
   
   // Shorthand the application namespace
   var app = namespace.app;
   
   ModifyTagGroup.Views.ModifyTagGroupView = BaseView.extend({
    template: "includes/javascript/app/templates/modifytagsgrouptemplate.html",
	tagName: 'div',
    className: 'checktag-del',
	id: "tagview_mod",

    initialize: function(options) {
	  options || (options = {});
	  this.tagController = app.tagController;
	  this.collection = options.collection;
      _.bindAll(this, 'render', 'close', 'addTag', 'tagCallBack', 'showAllNotes');
      //this.collection.bind('reset', this.render);
	  this.bindTo(this.collection, 'reset', this.render);

    },
	
	events: {
		"click #buttontag": "addTag",
		"click #allnotes": "showAllNotes"
    },

    render: function() {
	  var that = this;
      // Fetch the template, render it to the View element and call done.
      namespace.fetchTemplate(this.template, function(tmpl) {
		 $(that.el).append(tmpl());
		 //$("#bodyView").append(tmpl);
		 that.tagController.showModifyTagGroup(that);		
      });
	  
      return this;
    },
	
	addTag: function(e) {
		e.preventDefault();
		var view = this;
		var newTag = {tagname:$("#TagName").val(), userid: view.collection.userid};
		this.collection.create(newTag, { wait: true, success: view.tagCallBack });
	},
	
	
	
	showAllNotes: function() {
		app.noteRouter.navigate("#showAllNotes", {trigger: true}); 
	},
	
	tagCallBack: function(collection, response){
		var that = this;
		that.tagController.addOneModTag(that, response.Tag);
		$("#TagName").val("");
	},		
	
	close: function() {
		this.dispose();
	}

  });
  
   ModifyTagGroup.Views.ModifyTagView = BaseTagView.extend({
    template: "includes/javascript/app/templates/modifytagtemplate.html",	
	
	initialize: function(options) {
		options || (options = {});
		this.collection = options.collection;
		this.model = options.model;
    	_.bindAll(this, 'render', 'close', 'renameTag', 'destroy');    	
		//this.model.on("change:tagname", this.render);		
		//this.model.on("destroy", this.close, this);
		this.bindTo(this.model, 'change:tagname', this.render);
		this.bindTo(this.model, 'destroy', this.close);

    },
	
	events:{
		"click #removeTag": "destroy",
		"click .renameTag": "renameTag"
	},
	
	destroy: function(e){
		var that = this;
        that.model.destroy({
            success: function(){
            	that.resetTagView();
            },
            error: function(){
                alert("Error while removing tag.")
            }
        });
	},
	
	renameTag: function(e){
		var that = this;
		var templateHTML = "includes/javascript/app/templates/tagedittemplate.html";
		var tagEditDialog = $("#tagEditDialog").dialog({
	        autoOpen: false,
	        modal: true,
			width: "250px",
	        position: [e.clientX, e.clientY],
	        open: function(){
	           namespace.fetchTemplate(templateHTML, function(tmpl) {
				$("#tagEditDialog.ui-dialog-content").html(tmpl(that.model.toJSON()));
			   });
	        },
			buttons: {
				"Save": function(){
					var dialog = this;
					var newTagName = $(dialog).find("#tageditname").val();
					that.model.set("tagname", newTagName);
	                that.model.save({}, {
						success: function() {
							$(dialog).dialog("destroy");
							that.resetTagView();							
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
	},
	
	resetTagView: function(){
		mediator.publish('removeTags');
		mediator.publish('showTags');
	}
	
  });
  
  return ModifyTagGroup;
});
