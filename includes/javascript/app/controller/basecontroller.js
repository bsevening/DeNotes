define(["namespace", "jquery", "use!underscore", "use!backbone"], function(namespace, $, _, Backbone){

	var baseController = namespace.module();
		
	baseController.removeMainBody = function(view) {
		if (typeof(view) != "undefined") 
			view.close();
	}
	
	return baseController;
	
});