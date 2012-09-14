define([
  "namespace",

  // Libs
  "use!backbone"

  // Modules

  // Plugins
],

function(namespace, Backbone) {

  // Create a new module
  var WelcomeUserView = namespace.module();

  // Shorthand the application namespace
  var app = namespace.app;

  // This will fetch the tutorial template and render it.
  WelcomeUserView.Views.WelcomeView = Backbone.View.extend({
    template: "includes/javascript/app/templates/welcometemplate.html",
	tagName: 'div',
    className: 'bodyWelcomeView',
    id: "notesBaseView",
	
	initialize: function() {
		_.bindAll(this, 'render', 'close');
	},

    render: function(done) {
      var that = this;

      // Fetch the template, render it to the View element and call done.
      namespace.fetchTemplate(this.template, function(tmpl) {
      	$(that.el).append(tmpl());
      });
	  return this;
    },
	
	close: function() {
		this.remove();
		this.unbind();
	}
	
  });

  // Required, return the module for AMD compliance
  return WelcomeUserView;

});
