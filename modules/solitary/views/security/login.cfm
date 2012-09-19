<cfoutput>
	<div id="login" class="shadow round-corners">
		<h1>Login</h1>
		<p>Please login using your username and password.</p>
	
		<!--- display any messages in the event --->
		<!---#getPlugin("MessageBox").renderit()#--->
		
		<form id="loginForm" name="loginForm" method="POST">
			
			<div>
				<label for="username">Username:<label>
				<input id="username" type="text" name="username" value="{{ userName }}">
			</div>
			
			<div class="clear">&nbsp;</div>
			
			<div>
				<label for="password">Password:</label>
				<input id="password" type="password" name="password">
			</div>
	
			<input type="checkbox" id="rememberme" value="true" name="rememberme" {{ (userName!="")?"Checked":" " }}> Remember Me 
			<input type="submit" value="Login" name="submit" id="btnLogin">
			
			<div class="clear">&nbsp;</div>
			
			<span id="forgotpasswordlink" class="loginlink">forgot password?</a>
			<span id="newuserlink" class="loginlink">new user?</a>
		</form>
		<div id="newuserdialog" title="New User"></div>
	</div>
	
</cfoutput>


