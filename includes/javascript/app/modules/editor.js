define(["namespace", "jquery", "use!elrte"], function(namespace, $, elrte){

    var editor = namespace.module();
    
    editor.edit = function(target, model){
		
		var $noteContent = $(target);
		//$noteContent.append("this is text"); 
		
		 elRTE.prototype.save = function(){
        
            var note = $noteContent.elrte('val');
            $noteContent.elrte('destroy');
            
            model.set({
                note: note
            });
            model.save({}, {
                success: function(model, response){
                    $noteContent.html(response.data[0].title);
					model.set(response.data[0]);
                },
                error: function(){
                    alert("Error while saving the note.")
                }
            });
            delete target['elrte'];
            $noteContent.parent().find(".note-menu").hide();
			$noteContent.parent().find(".note-closed-delete").show();
        };
				
        elRTE.prototype.options.toolbars.web2pyToolbar = ['save', 'copypaste', 'undoredo', 'style', 'alignment', 'colors', 'format', 'indent', 'lists', 'links'];
        var opts = {
            styleWithCSS: false,
            height: 100,
            toolbar: 'web2pyToolbar'
        };
		
		// create editor		
        $noteContent.elrte(opts);
		
		//$(".note-menu").show();
        $noteContent.parent().find(".note-menu").show();
		$noteContent.parent().find(".note-closed-delete").hide();
		
		if (model.get('title')) { // if it has a title it's not new. Probably should change this and get the note and
			model.fetch({  // title on the initial get.
				success: function(model, response){
					// reset the note so it has the complete body. Default display is truncated and uses model.title.
					$noteContent.elrte('val', response.data.data[0].note);
				},
				error: function(){
					alert("Error while fetching the full note.")
				}
			});							
		}               
    };
	
	editor.closeEditor = function(target, model){
		var $noteContent = $(target).parents(".notebox").find(".note-content");
        var webeditor = $noteContent.get(0);
        if (webeditor['elrte']) {
            $(webeditor).elrte('destroy');
            delete webeditor['elrte'];
            $(target).parent(".note-menu").hide();
			$(target).parents(".menu:first").siblings(".note-closed-delete").show();
			var title = model.get('title');
			if (title)
				$noteContent.html(title); // Note has been saved.
			else
				model.clearNote(); // view listens for destroy event so it can close. It's a cancel on a new note.
        }
    };
    
    return editor;
});
