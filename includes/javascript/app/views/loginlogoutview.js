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
  var LoginLogoutView = namespace.module();
  
  // Shorthand the application namespace
  var app = namespace.app;

  // This will fetch the tutorial template and render it.
  LoginLogoutView.Views.InOutView = Backbone.View.extend({
    template: "includes/javascript/app/templates/userinfotemplate.html",
	  tagName: 'div',
    className: 'bodyLoginOutView',
           id: "logInOutBaseView",
	
	initialize: function() {
          _.bindAll(this, 'render', 'login'); //_.bindAll(this, 'render', 'close');
          this.model.bind("change:isLoggedIn", this.render);
		 
    },
	
	events: {
       'click #logon': 'login',
       'click #logout': 'logout'
   	},

    render: function(done) {
      var that = this;
	  data = this.model.toJSON();
	  that.$el.empty();

      // Fetch the template, render it to the View element and call done.
      namespace.fetchTemplate(this.template, function(tmpl) {
        $(that.el).append(tmpl(data));
      });
	  return this;
    },
	
	login: function() {
		mediator.publish('loginState');
		return false;
	},
	
	logout: function() {
		this.model.doLogout();
		return false;
	}
	
  });

  // Required, return the module for AMD compliance
  return LoginLogoutView;

});