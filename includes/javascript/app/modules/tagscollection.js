define(["namespace", 'use!underscore', 'use!backbone', 'modules/tagmodel'], function(namespace, _, Backbone, TagModel){

    var TagsCollection = namespace.module();
    
    TagsCollection.Collection = Backbone.Collection.extend({
    
        // Reference to this collection's model.
        model: TagModel.Model,
        
        initialize: function(options){
            options || (options = {});
            this.userid = options.userid;
        },
        
        url: function(){
            return 'http://servermachine.bsevening.com/DeNotes/index.cfm/Tag/' + this.userid;
        },
        
        parse: function(response){
            return response;
        }
        
    });
    return TagsCollection;
});
