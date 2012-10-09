define([
  "namespace",

  // Libs
  "jquery",
  "use!underscore",
  "use!backbone",
  "baseview"
],

function(namespace, $, _, Backbone, BaseView) {

  // Create a new module
  var BaseTagView = namespace.module();
  
  // Shorthand the application namespace
  var app = namespace.app;

  // This will fetch the tutorial template and render it.
  BaseTagView = BaseView.extend({
	tagName: 'div',
    className: 'a_tag',
	

    render: function(done) {
      var view = this;
	  var data = view.model.toJSON();
	  //$(view.el).empty();

      // Fetch the template, render it to the View element and call done.
      namespace.fetchTemplate(this.template, function(tmpl) {
        view.el.innerHTML = tmpl(data);
		
      });
	  return this;
    },
	
		
	close: function() {
		this.undelegateEvents();
		this.remove();
		this.unbind();
	}
	
	
	
  });

  // Required, return the module for AMD compliance
  return BaseTagView;

});