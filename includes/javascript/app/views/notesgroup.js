define(["namespace", 'jquery', 'use!underscore', 'use!backbone', 
	'aura/mediator', 'baseview'], 
	function(namespace, $, _, Backbone, mediator, BaseView){

	var app = namespace.app;
    var NotesGroup = namespace.module();
    
    NotesGroup.Views.NoteGroupView = BaseView.extend({
        template: "includes/javascript/app/templates/notesgrouptemplate.html",
        tagName: 'div',
        className: 'bodyNoteView',
        id: "notesBaseView",
        
        initialize: function(options){
			options || (options = {});
			this.collection = options.collection;
            _.bindAll(this, 'render', 'close', 'addNew');
            this.bindTo(this.collection, 'reset', this.render);
			this.noteController = app.noteController;
			//this.collection.on('reset', this.render);
        },
        
        events: {
            "click div#addnote": "addNew",
            "click div#allnotes:": "showAllNotes"
        },
        
        render: function(done){
            var that = this;
            // Fetch the template, render it to the View element and call done.
            namespace.fetchTemplate(this.template, function(tmpl){
                $(that.el).html(tmpl());
				that.delegateEvents();                
                that.noteController.showNoteGroup(that);                
            });
            
            return this;
        },
        
        addNew: function(e){
            var that = this;
			var webeditor = $("#note_group").find(".note-content:first").get(0);
            if (! webeditor['elrte']) { // check to see if new note open.
				that.noteController.showNewNote(that);				
			}
        },
        
        showAllNotes: function(){            
			app.noteRouter.navigate("#showAllNotes", {trigger: true});            
        },
        
        close: function(){
            this.dispose();
        }
        
    });
    
    NotesGroup.Views.NoteView = BaseView.extend({
        template: "includes/javascript/app/templates/notetemplate.html",
        tagName: 'div',
        className: 'a_note',
        
        initialize: function(){
            _.bindAll(this, 'render', 'close', 'showTags', 'removeNote'); //_.bindAll(this, 'render', 'close');            
			//this.model.on('destroy', this.close);
			//this.model.on('sync', this.render); 
			this.bindTo(this.model, 'destroy', this.close);
			this.bindTo(this.model, 'sync', this.render);          
        },
        
        events: {
            "click div.note-content": "editNote",
            "click div.close": "removeEditor",
            "click div.tag": "showNoteTags",
            "click div.note-closed-delete": "removeNote",
			"click div.note-open-delete": "removeNote"
        },
        
        render: function(done){
            var that = this;
            var data = that.model.toJSON();
            
            // Fetch the template, render it to the View element and call done.
            namespace.fetchTemplate(this.template, function(tmpl){
                that.el.innerHTML = tmpl(data);
            });
            return this;
        },
        
        // Loads Elrte editor for a note.
        editNote: function(e){           
			this.edit(e.target, this.model);
        },
        
		// Closes Elrte editor.
        removeEditor: function(e){
            this.closeEditor(e.target, this.model);
        },
        
        removeNote: function(e){                                    
          	mediator.publish('removeTags');
            mediator.publish('showTags');
			this.model.clearNote();                
        },
        
		//All of the following mediator calls in this function reside in the tag controller.
		//The funtion shows tags from witin a note so you can assign said note to your tags.
        showNoteTags: function(e){
            this.showTags(e);
        },
        
        close: function(){
            this.undelegateEvents();
            this.remove();
            this.unbind();
        }
        
    });
    
    return NotesGroup;
    
});
