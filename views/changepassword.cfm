<cfoutput>
<h1>DeNotes Change Password</h1>
#getPlugin("MessageBox").renderit()#
<form id="changePassword" method="post" action="#event.buildLink('remote_doChangePassword')#">
	<input type="hidden" name="userid" id="userid" value="#rc.userid#" />
	<input type="hidden" name="currentPassword" id="currentPassword" value="#rc.newPassword#" />
	<div class="flabel">
		<label for="newPassword">New Password:</label>
	</div>
	<div class="finput">
		<input type="password" name="newPassword"/>
	</div>
	<div class="clearfix"></div>
	<div class="flabel">
		<label for="newPasswordConfirm">Confirm New Password:</label>
	</div>
	<div class="finput">
		<input type="password" name="newPasswordConfirm"/>
	</div>
	<div class="clearfix"></div>	
	<div align="left" style="padding-left:150px">
		<input type="submit" value="Save">
	</div>	
</form>
</cfoutput>