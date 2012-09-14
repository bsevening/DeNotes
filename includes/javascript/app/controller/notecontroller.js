define(["namespace", "jquery", "use!underscore", "modules/notemodel", "modules/notecollection", 
		"views/notesgroup", "views/PaginationView", "aura/facade", "aura/mediator", 'modules/editor', 'modules/notetags'], 
function(namespace, $, _, NoteModel, NoteCollection, NotesGroup, PaginatedView, facade, mediator, Editor, NoteTags){

    var noteController = namespace.module();
    
    var userModel;
    var notesGroupView;
	var pagerView;
	var notesCollection;
    
    noteController.initialize = function(model){
        userModel = model;
		// A little composition which adds the Erlte editor and NoteTags which allows
		// us to assign a note to tags (groups).
		_.extend(NotesGroup.Views.NoteView.prototype, Editor, NoteTags); 
    }
    
    // Adds a new note view which displays a Erlte web editor.  			
    noteController.showNewNote = function(view){
        var $notes;
        var collection = view.collection;
        $notes = view.$("#note_group");
        var newNoteModel = new NoteModel.Model({
            'userid': userModel.get('userid')
        });
        var note = collection.create(newNoteModel);
        var noteView = new NotesGroup.Views.NoteView({
            model: note,
            collection: collection
        });
		
        view.storeChild(noteView);
        
		// Kind of a hack to make sure note is added to dom before
		// triggering the click.
        $(noteView.render().el).show('fast', function(){
            $notes.prepend(this); // Adds new note at the top.
            var $noteContent = $('div.note-content:first', this);
            $noteContent.trigger('click'); // Open the Erlte editor.
        });
                
    };
    
    noteController.showNoteGroup = function(view){
        var $notes;		
        var collection = view.collection;
        $("#bodyView > header").after(view.el);
        $notes = view.$("#note_group");		
        collection.each(function(note){
            var noteView = new NotesGroup.Views.NoteView({
                model: note,
                collection: collection
            });
			
			//var thisProto =  Object.getPrototypeOf(noteView);
            view.storeChild(noteView);
            $notes.append(noteView.render().el);
        });
    };
    
    noteController.getNotesGroupView = function(collection){
        return new NotesGroup.Views.NoteGroupView({
            collection: collection,
            noteController: noteController
        });
    };
	
	noteController.removeNotesGroup = function(collection){
    	noteController.removeMainBody(notesGroupView);
		noteController.removeMainBody(pagerView);
    };
    
    noteController.getNotesCollection = function(userid){
        return new NoteCollection.Collection({
            userid: userid
        });
    };
    
    // gets triggered in the router when selecting new tag group, hence the tag variable in the URL.
    // displays the notes which have this tag
    noteController.resetNotes = function(tag){        
        
        var NoteCollectionUrl = NoteCollection.Collection.extend({
			paginator_core: {
				type: 'GET',				
				dataType: 'json',
				url: function(){
					return 'http://servermachine.bsevening.com/DeNotes/index.cfm/note/' + this.userid + '/' + tag;
				}
			}
        });
        notesCollection = new NoteCollectionUrl({
            userid: userModel.get('userid')
        });
		
        notesGroupView = noteController.getNotesGroupView(notesCollection);
		pagerView = new PaginatedView.Views.PagingView({collection:notesCollection});
        
        notesCollection.pager();
    };
    
	// application wide events start here.
    facade.subscribe('noteDisplayRemove', 'removeNotesGroup', function(){
    	noteController.removeNotesGroup();
    });
    
    facade.subscribe('noteDisplay', 'showNotes', function(){
        notesCollection = noteController.getNotesCollection(userModel.get('userid'));
        notesGroupView = noteController.getNotesGroupView(notesCollection);
		pagerView = new PaginatedView.Views.PagingView({collection:notesCollection});
				
        //notesCollection.fetch();
		notesCollection.pager();
    });
	
	facade.subscribe('pagerNoteDisplay', 'pagerRemoveNotes', function(){
        notesGroupView.closeChildren();
		notesGroupView.$el.remove();
    });
    
    return noteController;
});
