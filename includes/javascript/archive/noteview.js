define(["namespace", // Libs
"jquery", "use!underscore", "use!backbone", "baseview", 'aura/mediator', "jqueryUI", "use!elrte", "use!cancel"// Modules

// Plugins
], function(namespace, $, _, Backbone, BaseView, mediator){

    // Create a new module
    var NoteView = namespace.module();
    
    // This will fetch the tutorial template and render it.
    NoteView.Views.NoteView = BaseView.extend({
        template: "includes/javascript/app/templates/notetemplate.html",
        tagNaame: 'div',
        className: 'a_note',
        
        target: "",
        
        initialize: function(){
            _.bindAll(this, 'render', 'close', 'showTags', 'removeNote'); //_.bindAll(this, 'render', 'close');
            //this.model.bind("change:isLoggedIn", this.render);
        },
        
        events: {
            "click div.note-content": "edit",
            "click div.close": "closeEditor",
            "click div.tag": "showTags",
			"click div.note-delete": "removeNote"
        },
        
        render: function(done){
            var view = this;
            var data = view.model.toJSON();
            //$(view.el).empty();
            
            // Fetch the template, render it to the View element and call done.
            namespace.fetchTemplate(this.template, function(tmpl){
                view.el.innerHTML = tmpl(data);
            });
            return this;
        },
        
        // Switch this view into `"editing"` mode, displaying the input field.
        edit: function(e){
            var view = this;
            elRTE.prototype.options.toolbars.web2pyToolbar = ['save', 'cancel', 'copypaste', 'undoredo', 'style', 'alignment', 'colors', 'format', 'indent', 'lists', 'links'];
            var opts = {
                styleWithCSS: false,
                height: 100,
                toolbar: 'web2pyToolbar'
            };
			
			//$(".note-menu").show();
			$(e.currentTarget).parent().find(".note-menu").show();
            
            elRTE.prototype.save = function(){
                //$('#saveMsg').attr('style', '').html('Saving note...');
                //$('#loaderAnim').click();
                
                var note = $(e.currentTarget).elrte('val');
                $(e.currentTarget).elrte('destroy');
                
                view.model.set({
                    note: note
                });
                view.model.save();
                delete e.currentTarget['elrte'];
				$(e.currentTarget).parent().find(".note-menu").hide();
            };
            
            // create editor
            $(e.currentTarget).elrte(opts);
            
        },
        
        closeEditor: function(e){
            var editor = $(e.currentTarget).parents(".notebox").find(".note-content").get(0);
            if (editor['elrte']) {
                $(editor).elrte('destroy');
                delete editor['elrte'];
				$(e.currentTarget).parent(".note-menu").hide();
            }
        },
		
		removeNote: function(e){
			var view = this;
            view.model.destroy({ 
			    wait:true, 
			    success: function() { 
					view.close();
					mediator.publish('removeTags');
					mediator.publish('showTags');		
			     }, 
			     error: function() { 
			          alert("Error occurred trying to remove from server?!"); 
			     } 
			}); 
        },
        
        showTags: function(e){
			var view = this;
            var tagDialog = $("#tagdialog").dialog({
                autoOpen: false,
                modal: true,
				width: "250px",
                position: [e.clientX, e.clientY],
                open: function(){
                    //$(this).closest(".ui-dialog").find(".ui-dialog-titlebar:first").hide();
					mediator.publish('showCheckTags', view);
                },
				buttons: {
					"Save": function(){
						mediator.publish('saveCheckTags', view);
						var dialog = this;
                        view.model.save({}, {
							success: function() {
								$(dialog).dialog("destroy");
								mediator.publish('removeCheckTags');
								mediator.publish('removeTags');
								mediator.publish('showTags');	
							},
                            error: function(){
                                alert("Error while saving tags.")
                            }
                        });						
					},
					"Cancel": function(){
						$(this).dialog("destroy");
						mediator.publish('removeCheckTags');
					}
				}
            });
            $(tagDialog).dialog('open');
            
        },
        
        close: function(){
            this.undelegateEvents();
            this.remove();
            this.unbind();
        }
        
    });
    
    // Required, return the module for AMD compliance
    return NoteView;
    
});
