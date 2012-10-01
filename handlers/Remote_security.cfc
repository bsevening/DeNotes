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
	
	public void function getUser(event){
		var rc = event.getCollection();		
		event.renderData(type="json",data=securityService.getUserSession(),jsonQueryFormat="array");
	}

	public void function doLogin(event) cache="false"{
		var rc = event.getCollection();
		
		event.paramValue("username","");
		event.paramValue("password","");
		event.paramValue("rememberme",false);
		
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
	/**
	 * a user is 'logged in' if a valid seesion exists for them
	 * to log them out simply remove the session user map
	 */	public void function logout(event){
		securityService.deleteUserSession();
		event.renderData(type="json",data=securityService.getUserSession(),jsonQueryFormat="array");
	}
	
	/**
	 * forgot password
	 */		public void function forgotPassword(){
		var rc = event.getCollection();				
		var result = {};
		result['exists'] = false;
		result['msg'] = "Forgot password can't be sent as were unable to find a record.";
		
		event.paramValue("email","");
		
		// we have a valid email address
		if( isValid("email",rc.email) ){
			var user = userService.findWhere({email=rc.email});				
			// and now we have a valid user
			if(!isNull(user)){
				// send the forgot password notification email
				securityService.sendForgotPasswordNotification(user);
				// TODO: update user with flag, user needs to change password				
				result['exists'] = true;
				result['msg'] = "Forgot password sent to your email on record.";					
			}
		}
						
		event.renderData(type="json",data=result,jsonQueryFormat="array");
		
	}
	/**
	 *
	 */
	public void function resetPassword(){
		var rc = event.getCollection();
		var user = userService.findWhere({emailPasswordHash=rc.eph});
		var baseURL = getSetting('htmlBaseURL');
		
		getPlugin("MessageBox").setMessage("error","");
		event.paramValue("newPassword","");		
		
		if( !isNull(user) ){
			rc.newPassword = userService.resetPassword(user);
			rc.userid = user.getUserId();
			setNextEvent(event="remote_changePassword",persist="newPassword,userid");
		} else {
			getPlugin("MessageBox").setMessage("info","We were unable to locate that account.");
			setNextEvent(url: baseURL);
		}
		
	}

	public void function changePassword(){
		var rc = event.getCollection();
		event.setView(view="changepassword", layout="Layout.Password");
	}

	public void function doChangePassword(){
		var rc = event.getCollection();
		var user = userService.findWhere({userid=rc.userid});
		var baseURL = getSetting('htmlBaseURL');

		// currentPassword,newPassword,newPasswordConfirm
		if( !isNull(user) && (rc.newPassword == rc.newPasswordConfirm) ){
			userService.changePassword(user.getUserId(),rc.newPassword);
			getPlugin("MessageBox").setMessage("info",'Your password has been changed.');
			setNextEvent(url: baseURL);			
		} else {
			// user is null or passwords do not match
			if( isNull(user) ){
				getPlugin("MessageBox").setMessage("error","We could not locate the account that you are trying to change..");
			} else {
				getPlugin("MessageBox").setMessage("error","The password and confirm password did not match, please try again.");
			}
			setNextEvent(event="remote_changepassword",persist="newPassword,userid");
		}					
	}
	
	public void function accessDenied(){
		
	}
		
}
