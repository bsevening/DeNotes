<cfscript>
	// Allow unique URL or combination of URLs, we recommend both enabled
	setUniqueURLS(false);
	// Auto reload configuration, true in dev makes sense to reload the routes on every request
	//setAutoReload(false);
	// Sets automatic route extension detection and places the extension in the rc.format variable
	// setExtensionDetection(true);
	// The valid extensions this interceptor will detect
	// setValidExtensions('xml,json,jsont,rss,html,htm');
	// If enabled, the interceptor will throw a 406 exception that an invalid format was detected or just ignore it
	// setThrowOnInvalidExtension(true);

	// Base URL
	if( len(getSetting('AppMapping') ) lte 1){
		setBaseURL("http://#cgi.HTTP_HOST#/index.cfm");
	}
	else{
		setBaseURL("http://#cgi.HTTP_HOST#/#getSetting('AppMapping')#/index.cfm");
	}
	
	// Module Routing Added
	//addModuleRoutes(pattern="/solitary", module="solitary");

	// Your Application Routes	
	addRoute(pattern="Tag/:id-numeric/:userid",handler="Tag",action={
  		 DELETE = "remove", GET = "getTags", PUT = "save"
	});
	addRoute(pattern="Tag/:id",handler="Tag",action={
  		GET = "getTags", HEAD ="info", POST = "create"
	});
	addRoute(pattern="Note/:id?/:tagid-numeric?",handler="Note",action={
  		GET = "getNotes", POST = "create", PUT = "save", DELETE = "remove", HEAD ="info"
	});
	
	addRoute(pattern="/remote_doLogin/:username/:password/:rememberme", handler="Remote_security", action={
			  GET = "doLogin", POST = "doLogin", PUT = "save", DELETE = "remove", HEAD ="info"
			});
			
	addRoute(pattern="/remote_getUser", handler="Remote_security", action={
			  GET = "getUser", POST = "getUser", PUT = "save", DELETE = "remove", HEAD ="info"
			});	
	addRoute(pattern="/remote_logout", handler="Remote_security", action={
			  GET = "logout", POST = "logout", PUT = "save", DELETE = "remove", HEAD ="info"
			});
	addRoute(pattern="/remote_users/save", handler="Remote_users", action={ POST = "save" });
	addRoute(pattern="/remote_users/usernameExists/:username", handler="Remote_users",action="usernameExists");
	addRoute(pattern="/remote_forgotpassword/:email", handler="Remote_security",action="forgotPassword");
	addRoute(pattern="/remote_resetPassword/:eph", handler="Remote_security",action="resetPassword");
	addRoute(pattern="/remote_changePassword", handler="Remote_security",action="changePassword");
	addRoute(pattern="/remote_doChangePassword", handler="Remote_security",action="doChangePassword");	
	
	addRoute(pattern=":handler/:action?");


	/** Developers can modify the CGI.PATH_INFO value in advance of the SES
		interceptor to do all sorts of manipulations in advance of route
		detection. If provided, this function will be called by the SES
		interceptor instead of referencing the value CGI.PATH_INFO.

		This is a great place to perform custom manipulations to fix systemic
		URL issues your Web site may have or simplify routes for i18n sites.

		@Event The ColdBox RequestContext Object
	**/
	function PathInfoProvider(Event){
		/* Example:
		var URI = CGI.PATH_INFO;
		if (URI eq "api/foo/bar")
		{
			Event.setProxyRequest(true);
			return "some/other/value/for/your/routes";
		}
		*/
		return CGI.PATH_INFO;
	}
</cfscript>