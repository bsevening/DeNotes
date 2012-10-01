define(["namespace", "jquery", "underscore", "modules/usermodel", "views/accessview", "views/welcomeview", "aura/facade", "aura/mediator", "validate"], 
function(namespace, $, _, UserModel, AccessView, WelcomeUserView, facade, mediator){

    var app = namespace.app;
    // Needed to change these as didn't realize at first that namespace.module was adding
    // the attribute views.	
    var loginController = {};
    var userModel;
    var loginView;
    var welcomeView;
    
    loginController.initialize = function(model){
        userModel = model
    }
    
    // Subscription 'modules' for our views. These take the 
    // the form facade.subscribe( subscriberName, notificationToSubscribeTo , callBack )         	
    facade.subscribe('loginStateDisplay', 'loginState', function(){
        loginController.loginState();
    });
    
    loginController.loginState = function(){
        if (userModel.get('userid') != 0) {
            this.removeWelcome();
            this.removeLogin();
            mediator.publish('showNotes'); //note controller
            mediator.publish('showTags'); //tag controller
        }
        else {
            //we remove everything instead of maintaining some sort of state tracker.			
            mediator.publish('removeNotesGroup'); //note controller
            mediator.publish('removeTags'); //tag controller
            mediator.publish('removeModTags'); //tag controller
            this.showWelcome();
            this.showLogin();
            app.noteRouter.navigate("/");
        }
    };
	
	loginController.userForgotPassword = function(event) {
		var forgotPasswordView = new AccessView.Views.ForgotPasswordView({
            model: userModel
        });
		
		var dfd = forgotPasswordView.pre_render();
		dfd.done(function(tmpl){
			
	        var forgotPasswordDialog = $("#forgotpassworddialog").dialog({
	            autoOpen: false,
	            modal: true,
	            width: "auto",
	            position: ['left', 'top'],
	            open: function(){
	                //$(this).closest(".ui-dialog").find(".ui-dialog-titlebar:first").hide();
	                $("#forgotpassworddialog.ui-dialog-content").html(forgotPasswordView.el);                        
	                $('#forgotPasswordForm', forgotPasswordView.render(tmpl).el).validate({
	                    errorPlacement: function(error, element){
	                        error.insertBefore(element);
	                    },
	                 
	                    onkeyup: false,
	                    debug: true
	                });
	            },
	            buttons: {
	                "Continue": function(){
	                    userModel.submitForgotPassword($("#forgotemail", this).val());
						forgotPasswordView.close();						
						$(this).dialog("destroy");
	                },
	                "Cancel": function(){
						forgotPasswordView.close();
	                    $(this).dialog("destroy");
	                }
	            }
	        });
	        $(forgotPasswordDialog).dialog('open');
			
		});
	};	
    
    loginController.newUser = function(e){    	
		
        var newUserView = new AccessView.Views.NewUserView({
            model: userModel
        });
        
		// Need to use jQuery promise returned from fetch template or the validate
		// will fail. Dom won't be ready on initial fetch. Template is cached after initial fetch.
		var dfd = newUserView.pre_render();
		dfd.done(function(tmpl){
			
	        var newUserDialog = $("#newuserdialog").dialog({
	            autoOpen: false,
	            modal: true,
	            width: "auto",
	            position: ['left', 'top'],
	            open: function(){
	                //$(this).closest(".ui-dialog").find(".ui-dialog-titlebar:first").hide();
	                $("#newuserdialog.ui-dialog-content").html(newUserView.el);                        
	                $('#newUserForm', newUserView.render(tmpl).el).validate({
	                    errorPlacement: function(error, element){
	                        error.insertBefore(element);
	                    },
	                 
	                    onkeyup: false,
	                    debug: true
	                });
	            },
	            buttons: {
	                "Create": function(){
	                    $("#newUserForm").submit();
						newUserView.close();
						$(this).dialog("destroy");
	                },
	                "Cancel": function(){
						newUserView.close();
	                    $(this).dialog("destroy");
	                }
	            }
	        });
	        $(newUserDialog).dialog('open');
			
		});
    };
    
    loginController.showLogin = function(){
        loginView = new AccessView.Views.LoginView({
            model: userModel
        });
        $("#mainview").append(loginView.render().el);
    };
    
    loginController.removeLogin = function(){
        if (typeof(loginView) != "undefined") {
            loginView.close();
        }
    };
    
    loginController.showWelcome = function(){
        welcomeView = new WelcomeUserView.Views.WelcomeView();
        $("#bodyView").append(welcomeView.render().el);
    };
    
    loginController.removeWelcome = function(){
        if (typeof(welcomeView) != "undefined") {
            welcomeView.close();
        }
    };
    
    return loginController;
});
