define(["namespace", "jquery", "underscore", "views/loginview", "views/welcomeview", "aura/facade", "aura/mediator"], 
function(namespace, $, _, LoginView, WelcomeUserView, facade, mediator){
	
	var app = namespace.app;	
	var loginController = namespace.module();
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
	
	loginController.loginState = function() {
		if (userModel.get('userid') != 0) {
			this.removeWelcome();
			this.removeLogin();
			mediator.publish('showNotes'); //note controller
			mediator.publish('showTags'); //tag controller
		} else {
			this.showWelcome();
			//we remove everything instead of maintaining some sort of state tracker.			
			mediator.publish('removeNotesGroup'); //note controller
			mediator.publish('removeTags'); //tag controller
			mediator.publish('removeModTags'); //tag controller
			this.showLogin();
			app.noteRouter.navigate("/");		
		}
	};
	
	loginController.showLogin = function() {
		loginView = new LoginView.Views.LoginView({
            model: userModel
        });
        $("#mainview").append(loginView.render().el);
	};
	
	loginController.removeLogin = function() {
		if (typeof(loginView) != "undefined") {
            loginView.close();
        }
	};
	
	loginController.showWelcome = function() {
		welcomeView = new WelcomeUserView.Views.WelcomeView();
		$("#bodyView").append(welcomeView.render().el);
	};
	
	loginController.removeWelcome = function() {
		if (typeof(welcomeView) != "undefined") {
			welcomeView.close();
		}
	};	
    
    return loginController;
});
