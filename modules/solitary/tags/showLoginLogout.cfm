<cfparam name="user" >
<cfset sessionStorage = controller.getPlugin("SessionStorage")>

<cfoutput>
<cfif sessionStorage.exists('user')>
	<cfset user = sessionStorage.getVar('user')>
</cfif>
	
<cfif isStruct(user)>
	Welcome #user.firstname# #user.lastname# | <a href="#event.buildLink('security.logout')#">Logout</a>
<cfelse>
	Welcome Guest User | <a href="#event.buildLink('security.login')#">Login</a>
</cfif>

</cfoutput>