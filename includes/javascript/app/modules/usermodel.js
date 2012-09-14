define(["namespace", "jquery", "use!underscore", "use!backbone", "aura/mediator", "use!cookie"], 
function(namespace, $, _, Backbone, mediator) {
	// Create a new module
  	var UserModel = namespace.module();
	// Shorthand the application namespace
  	var app = namespace.app;
	
	UserModel.Model = Backbone.Model.extend({
		
		urlRoot: '/DeNotes/index.cfm/security/getUser/',		
		
		parse: function(response) {
	      return response.data;
	  	},
		
		// Default attributes for the user.
		defaults: function() {
            
            return {
                firstName: "",
                lastName: "",
                userName: $.cookie("USERNAME", {
                    path: "/",
                    raw: true
                }),
                isLoggedIn: false,
                userid: 0
            }
		},		
		
		triggerState: function() {
			if (this.get('userid')) {
				this.set('isLoggedIn', true);														
			}
			else {
				this.set('isLoggedIn', false);														
			}
			
			mediator.publish('loginState'); //Subscriber in login controller.
		},
		
		login: function(name, password, rememberme) {
			var that = this;
			this.fetch({
				url :  "/DeNotes/index.cfm/security/doLogin/" + name + "/" + password + "/" + rememberme,
				//data: { username: name, password: password, rememberme: rememberme},
				success: function(model, response) {
					//view.render();
					if (response.error) {
						$("#loginError").html("Your user name or password are incorrect "  + response.username + ".").show();
					} else {
						$("#loginError").hide();
						model.set(response.User);
						that.triggerState();
					}
				},
				error: function() {alert("Network error logging in! Please try again.");},
				 
			});
			
			return false;
		},
		
		getUser: function() {
			var that = this;
			this.fetch({
				success: function(model, response) {
					model.set(response.User);
					model.set('userName', $.cookie("USERNAME", {path:"/", raw: true}));					
					that.triggerState();
				},
				error: function() {alert("Network error getting user! Please try again.");},
				 
			});
			
			return false;
		},
		
		doLogout: function() {
			var that = this;
			this.fetch({
				url :  "index.cfm/security/logout/",
				success: function(model, response) {					
					model.clear({silent:true});
					model.set(model.defaults());					
					that.triggerState();
				},
				error: function() {alert("Network error logging out! Please try again.");}
				 
			});
		}
	
	});
	return UserModel;
});
