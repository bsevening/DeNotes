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
  var LoginView = namespace.module();
  
  // Shorthand the application namespace
  var app = namespace.app;

  // This will fetch the tutorial template and render it.
  LoginView.Views.LoginView = Backbone.View.extend({
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
	   'click #forgotpassword': 'forgotPassword'
   	},
	
	close: function() {
		this.remove();
		this.undelegateEvents(); 
		this.unbind();
	},
	
	forgotPassword: function() {
		//need to implement;
	},
	
	saveToModel: function(event) {
	   event.preventDefault();
       // this triggers a RESTFul POST (or PUT) request to the URL specified in the model
       this.model.login($("#username").val(), $("#password").val(), $("#rememberme").val());
   	}
	
  });

  // Required, return the module for AMD compliance
  return LoginView;

});
