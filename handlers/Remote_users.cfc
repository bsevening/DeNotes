component {

	/**
     * @securityService.inject model:securityService@Solitary
     * @userService.inject model:userService@Solitary
     * @cookieStorage.inject coldbox:plugin:CookieStorage
     */
     
	public function init(any securityService, any userService, any cookieStorage) {
		variables.securityService = arguments.securityService;
		variables.userService = arguments.userService;
		variables.cookieStorage = arguments.cookieStorage;		
		return this;
	}
	

	public any function save(event){
		// Custom interceptor runs to help poulate request collection because
		// backbone sends json in request body.
		var rc = event.getCollection();		
		rc.user = populateModel(userService.new(entityName="User", properties=rc));
				
		roles = userService.addRoles('402880e7372c9da201372d6714420015');
		
		rc.user.addroles(roles);
		
		event.paramValue("rememberme",false);
		event.paramValue("username","");
		event.paramValue("password","");
		
		userService.save( rc.user );		
		
		if( securityService.isUserVerified(rc.username,rc.password) ){
			securityService.updateUserLoginTimestamp();
			// if the user selected remember set a cookie
			if( rc.rememberme ){
				cookieStorage.setVar("username",trim(rc.username),999);
			}
				
			//setNextEvent( variables.defaultEvent );
			event.renderData(type="json",data=securityService.getUserSession(),jsonQueryFormat="array");
		}
		else{
			var error = {error = "login", username = rc.username};
			var loginError = SerializeJSON(error);
			event.renderData(type="json",data=error,jsonQueryFormat="array");
		}
	}
	
	public void function usernameExists(event) {
		var rc = event.getCollection();
		var user = userService.executeQuery("from User where email = :arg OR username = :arg",{arg=rc.username},0,0,0,false);
		var result = {};
		
		//writeDump("#user#");abort;
		
		if( user.recordcount ){
			result['exists'] = true;
			result['msg'] = "username is unavailable";
		} else {
			result['exists'] = false;
			result['msg'] = "username is available";
		}
		
		event.renderData(type="JSON",data=result,nolayout=true);
	}

}