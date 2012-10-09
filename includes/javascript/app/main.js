require(["namespace", "jquery", "use!backbone", // Libs  
"views/loginlogoutview", // Modules/views  
"modules/usermodel", "aura/mediator", "controller/notecontroller", "controller/tagcontroller", 
"controller/basecontroller", "controller/logincontroller"], // Modules/models
function(namespace, $, Backbone, LoginLogoutView,
	UserModel, mediator, NoteController, TagController, BaseController,  LoginController) {
		
	// Shorthand the application namespace
    var app = namespace.app;
	
    _.templateSettings = {
        evaluate: /\{\[([\s\S]+?)\]\}/g,
        interpolate: /\{\{(.+?)\}\}/g
    };
	
	// initialize user
	var userModel = new UserModel.Model();

	var historyStart = function(isSilent) {
		// Trigger the initial route and enable HTML5 History API support
        Backbone.history.start({
            root: "",
            pushState: false,
			silent: isSilent
        });
	};
	
	var NoteRouter = Backbone.Router.extend({
		
        routes: {
            "/": "index",		
			"tagGroup/:tagID": "tagGroup",
			"showAllNotes": "showAllNotes",
			"manageTags": "editTags",
            ":hash": "index"			
        },
        
        index: function(hash){			
          	app.loginController.loginState(); //login controller
        },
		
		tagGroup: function(tagID) {
			app.noteController.removeNotesGroup(); //note controller
			app.tagController.removeModifyTags(); //tag controller
			app.noteController.resetNotes(tagID); //note controller
		},
		
		showAllNotes: function() {
			app.tagController.removeModifyTags(); //tag controller
			app.noteController.removeNotesGroup(); //note controller
			mediator.publish('showNotes'); //note controller
		},
		
		editTags: function() {
			app.noteController.removeNotesGroup(); //note controller
			app.tagController.removeModifyTags(); //tag controller
			app.tagController.showModifyTags(); //tag controller
		}
    });	
	
	// Array Remove - By John Resig (MIT Licensed)
	Array.prototype.remove = function(from, to) {
	  var rest = this.slice((to || from) + 1 || this.length);
	  this.length = from < 0 ? this.length + from : from;
	  return this.push.apply(this, rest);
	};
	
    // Treat the jQuery ready function as the entry point to the application.
    // Inside this function, kick-off all initialization, everything up to this
    // point should be definitions.
    $(function() {		
		// get user model
		userModel.getUser();
		_.extend(TagController, BaseController).initialize(userModel);
		_.extend(NoteController, BaseController).initialize(userModel);
		LoginController.initialize(userModel);
		var inoutView = new LoginLogoutView.Views.InOutView({
	        model: userModel
	    });
		$("#loginLogoutView").append(inoutView.render().el);
		
		$("body").click(function(e) {
			if (! $(e.target).hasClass('tag-content')) {
				$(".tag-content").removeClass("red_selected");
			}
		});		
		
        // Define your master router on the application name space and trigger all
        // navigation from this instance.
		app.noteController = NoteController;
        app.tagController = TagController;
        app.loginController = LoginController;
        app.noteRouter = new NoteRouter();
		historyStart(false);
    });
    
    
    // All navigation that is relative should be passed through the navigate
    // method, to be processed by the router.  If the link has a data-bypass
    // attribute, bypass the delegation completely.
    $(document).on("click", "a:not([data-bypass])", function(evt){
        // Get the anchor href and protcol
        var href = $(this).attr("href");
        var protocol = this.protocol + "//";
        
        // Ensure the protocol is not part of URL, meaning its relative.
        if (href && href.slice(0, protocol.length) !== protocol &&
        href.indexOf("javascript:") !== 0) {
            // Stop the default event to ensure the link will not cause a page
            // refresh.
            evt.preventDefault();
            
            // `Backbone.history.navigate` is sufficient for all Routers and will
            // trigger the correct events.  The Router's internal `navigate` method
            // calls this anyways.
            Backbone.history.navigate(href, true);
        }
    });
    
});
