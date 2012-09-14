define(["namespace", "jquery", "underscore", "modules/tagscollection", "modules/tagmodel", "views/counttaggroup",
'views/modifytaggroup', "aura/facade", "aura/mediator"], 
function(namespace, $, _, TagsCollection, TagModel, CountTagGroup, ModifyTagGroup, facade, mediator){

	var tagController = namespace.module();

    var userModel;
    var tagsGroupView;
	var checkTagsGroupView;
	var modifyTagsGroupView;
    
    tagController.initialize = function(model){
        userModel = model
    }
    
    // Subscription 'modules' for our views. These take the 
    // the form facade.subscribe( subscriberName, notificationToSubscribeTo , callBack )
	
	//modify tags setup for removing tags from the system.
	//displayed in the main body of app.
	tagController.showModifyTagGroup = function(view) {	
		var $tags, collection = view.collection;
		$("#bodyView").append(view.el);
		$tags = view.$("#tag_group_mod");
        collection.each(function(tag) {
            var modifyTagView = new ModifyTagGroup.Views.ModifyTagView({
                model: tag,
                collection: collection				
            });
			view.storeChild(modifyTagView);
            $tags.append(modifyTagView.render().el);
        });
    };
	
	tagController.showModifyTags = function() {
		var checkTagsCollection = this.getTagCollection('http://servermachine.bsevening.com/DeNotes/index.cfm/Tag/0/'  + userModel.get('userid'));
        modifyTagsGroupView = new ModifyTagGroup.Views.ModifyTagGroupView({
            collection: checkTagsCollection
        });
        
        checkTagsCollection.fetch();
    };
	//end modify tags setup
	
	//appends child views to the group tag view. Allows for easy removal later.
	tagController.showCountTags = function(view){
		var $tags, collection = view.collection;
        $("#mainview").append(view.el);
		$tags = view.$("#tag_group");
        collection.each(function(tag) {
            var tagCountView = new CountTagGroup.Views.CountTagView({
                model: tag,
                collection: collection
            });
			view.storeChild(tagCountView);
            $tags.append(tagCountView.render().el);
        });
    };
	
	//add a tag from within the management view of tags.
	tagController.addOneModTag = function(view, tag){
		var $tags, collection = view.collection;
        $tags = view.$("#tag_group_mod");
        var modifyTagView = new ModifyTagGroup.Views.ModifyTagView({
            model: new TagModel.Model(tag),
            collection: collection
        });
		view.storeChild(modifyTagView);
        $tags.append(modifyTagView.render().el);
    };		
	
	// displayed in the main body of app. This view allows you to delete a tag.
	tagController.removeModifyTags = function() {		
		this.removeMainBody(modifyTagsGroupView);
    };	
	
	//extend tags collection with new url and parse functions.
	tagController.getTagCollection = function(url) {
		var tagCollection = TagsCollection.Collection.extend({
			url: function () {
				return url;
        	},
			parse: function(response) {
		      return response.data;
		  	}      
        });
		
		return new tagCollection({
            userid: userModel.get('userid')
        });
	};
	
	// application wide events start here.
	facade.subscribe('tagDisplay', 'showTags', function(view){
		var tagsCollection = tagController.getTagCollection('http://servermachine.bsevening.com/DeNotes/index.cfm/Tag/' + userModel.get('userid'));
        tagsGroupView = new CountTagGroup.Views.CountTagGroupView ({
            collection: tagsCollection
        });
        
        tagsCollection.fetch();
    });
	
	//initial display of tags shown after login and have counts for notes
    facade.subscribe('removeTagDisplay', 'removeTags', function(){        
		tagController.removeMainBody(tagsGroupView);		
    });
	
	facade.subscribe('removeModTagDisplay', 'removeModTags', function(){        
		tagController.removeModifyTags();		
    });
    
    return tagController;
});
