define(["namespace", "jquery", 'views/checktaggroup', "modules/tagscollection", "aura/mediator", "modules/tagmodel", 'jqueryUI'], 
	function(namespace, $, CheckTagGroup, TagsCollection, mediator, TagModel){

    var NoteTags = namespace.module(), checkTagGroupView;
    
    NoteTags.showTags = function(e){
		var that = this;
        var tagDialog = $("#tagdialog").dialog({
            autoOpen: false,
            modal: true,
            width: "250px",
            position: [e.clientX, e.clientY],
            open: function(){
                //$(this).closest(".ui-dialog").find(".ui-dialog-titlebar:first").hide();
                that.showCheckTags(that);
            },
            buttons: {
                "Save": function(){						
					var note = $(e.target).parents(".notebox").find(".note-content").elrte('val');
	                that.model.set({ note: note });
                    NoteTags.saveCheckTags(that);
                    var dialog = this;
                    that.model.save({}, {
						wait: true,
                        success: function(model, response){
                            $(dialog).dialog("destroy");
                            that.removeCheckTags();
							// Facade in Tag controller.
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
                    that.removeCheckTags();
                }
            }
        });
        $(tagDialog).dialog('open');
            
	}
	
	// Shows the tags so you can assign them to a note.	
	NoteTags.showCheckTagGroup = function(view, noteModel){
		var $tags, collection = view.collection;
        $("#tagdialog.ui-dialog-content").html(view.el);
		$tags = view.$("#tag_group");
        collection.each(function(tag) {
            var checkTagView = new CheckTagGroup.Views.CheckTagView({
                model: tag,
                collection: collection,
				noteModel: noteModel
            });
			view.storeChild(checkTagView);
            $tags.append(checkTagView.render().el);
        });
    };
	
	NoteTags.showCheckTags = function(view){
		var that = view;	
		var checkTagsCollection = NoteTags.getTagCollection('http://servermachine.bsevening.com/DeNotes/index.cfm/Tag/' + view.model.get('id') + "/" + view.model.get('userid'), view.model);
        checkTagGroupView = new CheckTagGroup.Views.CheckTagGroupView({
            collection: checkTagsCollection,
			noteModel : view.model
        });
        
        checkTagsCollection.fetch({			
			success: function(collection, response){				
				var groupView = checkTagGroupView;
				$(checkTagGroupView.render().el).show('fast', function(){
		            that.showCheckTagGroup(checkTagGroupView, view.model);
		        });
				
				// Gets triggered in CheckTagGroup.Views.CheckTagGroupView via model.create.
				checkTagsCollection.on("sync", function(tagModel){
					that.addOneTag(groupView, tagModel.get('Tag'));
				});
				
			},
			error: function(){
				alert("Error while fetching the Tags.")
			}
		});
    };
	
	//allows user to add a tag from the tag display within a note view.
	NoteTags.addOneTag = function(view, model){
		var $tags, collection = view.collection; noteModel = view.noteModel;
        $tags = view.$el.find("#tag_group");
        var checkTagView = new CheckTagGroup.Views.CheckTagView({
            model: new TagModel.Model(model),
            collection: collection,
			noteModel: noteModel
        });
		view.storeChild(checkTagView);
        $tags.append(checkTagView.render().el);
		$("#TagName").val("");
    };	
	
	NoteTags.removeCheckTags = function(){        
		checkTagGroupView.close();        
    };	
	
	NoteTags.saveCheckTags = function(view){
		var view = view;
		view.model.attributes.notetags = [];
       	$(".checkTags").each(function () {
		   var val = $(this).val();
           if (this.checked) {
		   		view.model.attributes.notetags.push(val);
		   } else {
				var itemIndex = $.inArray(val, view.model.attributes.notetags);
				if (itemIndex !== -1)
					view.model.attributes.notetags.remove(itemIndex);
		   }
		});
    };
	
	NoteTags.getTagCollection = function(url, model) {
		var tagCollection = TagsCollection.Collection.extend({
			url: function () {
				return url;
        	},
			parse: function(response) {
		      return response.data;
		  	}      
        });
		
		return new tagCollection({
            userid: model.get('userid')
        });
	};
	
	return NoteTags;
});