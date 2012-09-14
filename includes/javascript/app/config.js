// Set the require.js configuration for your application.
require.config({
  // Initialize the application with the main application file
  deps: ["main"],

  paths: {
    // JavaScript folders
    libs: "../../javascript/assets/js/libs",
    plugins: "../../javascript/assets/js/plugins",
	templates: "../../templates",

    // Libraries
    jquery: "../../javascript/assets/js/libs/jquery",
    underscore: "../../javascript/assets/js/libs/underscore",
    backbone: "../../javascript/assets/js/libs/backbone",
	paginator: "../../javascript/assets/js/libs/backbone.paginator",
	jqueryUI: "../../javascript/assets/js/libs/jquery-ui-1.8.21.custom.min",
	elrte: "../../javascript/assets/js/libs/elrte-1.3/js/elrte.full",
	
    use: "../../javascript/assets/js/plugins/use",
	cookie: "../../javascript/assets/js/plugins/jquery.cookie",
	//cancel: "../../javascript/assets/js/libs/elrte-1.3/src/elrte/js/ui/cancel"
	
  },

  use: {
    backbone: {
      deps: ["use!underscore", "jquery"],
      attach: "Backbone"
    },	
	
	cookie: {
	  deps: ["jquery"]	
	},
	
	jqueryUI: {
	  deps: ["jquery"]	
	},
	
	elrte: {
	  deps: ["jquery", "jqueryUI"]
	},

    underscore: {
      attach: "_"
    }
  }
});
