<cfoutput>

	<p style="width:410px">
		Enter the e-mail address associated with your account, then click Continue. 
		We'll email you a link to a page where you can easily create a new password.
	</p>
	<form id="forgotPasswordForm">
		<fieldset>
			<legend>
				Password Recovery
			</legend>
			<label for="email">
				Email Address:
			</label>
			<input type="text" name="email" id="forgotemail" class="required email">
			<!---<input type="button" name="submit" value="Continue">--->
		</fieldset>
	</form>
	
	<div class="clearfix">
	</div>
</cfoutput>