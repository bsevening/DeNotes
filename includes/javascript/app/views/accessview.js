define([
  "namespace",

  // Libs
  "jquery",
  "use!underscore",
  "use!backbone"

  // Modules

  // Plugins
],

function(namespace, $, _, Backbone) {
    
  // Create a new module
  var AccessView = namespace.module();
  
  // Shorthand the application namespace
  var app = namespace.app;

  // This will fetch the tutorial template and render it.
  AccessView.Views.LoginView = Backbone.View.extend({
    template: "/DeNotes/modules/solitary/views/security/login.cfm",
	tagName: 'div',
    className: 'box shadow round-corners height-9',
	id: "loginBoxView",
	
	initialize: function() {
          _.bindAll(this, 'render', 'close');          
          this.model.view = this;
    },
	
    render: function(done) {
      var that = this;
	  data = this.model.toJSON();

      // Fetch the template, render it to the View element and.
      namespace.fetchTemplate(this.template, function(tmpl) {        
		that.$el.append(tmpl(data));		
      });
	  return this;
    },
	
	events: {
       'submit #loginForm': 'saveToModel',
	   'click #forgotpasswordlink': 'forgotPassword',
	   'click #newuserlink': 'newUser'
   	},
	
	close: function() {
		this.remove();
		this.undelegateEvents(); 
		this.unbind();
	},
	
	forgotPassword: function() {
		//need to implement;
	},
	
	newUser: function(event) {
		event.preventDefault();
		app.loginController.newUser(event);	
	},
	
	saveToModel: function(event) {
	   event.preventDefault();
       // this triggers a RESTFul POST (or PUT) request to the URL specified in the model
       this.model.login($("#username").val(), $("#password").val(), $("#rememberme").val());
   	}
	
  });
  
  
  AccessView.Views.NewUserView = Backbone.View.extend({
    template: "includes/javascript/app/templates/newuser.html",
	tagName: 'div',
    className: 'box shadow round-corners',
	id: "newUserView",
	
	initialize: function() {
       _.bindAll(this, 'render', 'close');		            
    },
	
    render: function(done) {
      var that = this;
	  data = this.model.toJSON();

      // Fetch the template, render it to the View element and.
      namespace.fetchTemplate(this.template, function(tmpl) {        
		that.$el.append(tmpl(data));		
      });
	  return this;
    },
	
	events: {
       'submit #newUserForm': 'createUser'
   	},
	
	close: function() {
		this.remove();
		this.undelegateEvents(); 
		this.unbind();
	},
	
	createUser: function() {
	   //event.preventDefault();
       // this triggers a RESTFul POST (or PUT) request to the URL specified in the model
	   var newUser = {
	   		firstName: $("#firstName").val(), 
			lastName: $("#lastName").val(), 
			userName: $("#newusername").val(),
			password: $("#newuserpassword").val(),
			   email: $("#email").val()
	   }
	   this.model.set(newUser);
       this.model.createUser();
   	}
	
  });

  // Required, return the module for AMD compliance
  return AccessView;

});
