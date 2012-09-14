define([], function () {

	// Permissions

	// A permissions structure can support checking
	// against subscriptions prior to allowing them 
	// to clear. This enforces a flexible security 
	// layer for your application.

	var permissions = {

		showNotes: {
			noteDisplay:true
		},		
		
		pagerRemoveNotes: {
			pagerNoteDisplay:true	
		},

		removeNotesGroup:{
			noteDisplayRemove:true
		},
		
		showTags:{
			tagDisplay:true
		},
		
		removeTags:{
			removeTagDisplay:true
		},
		
		showLogin:{
			loginDisplay:true
		},
		
		removeLogin:{
			removeLoginDisplay:true
		},
		
		showCountTagGroup:{
			tagDisplayGroups:true
		},		
		
		removeModTags:{
			removeModTagDisplay:true
		},
		
		loginState:{
			loginStateDisplay:true
		}
	};

	permissions.validate = function(subscriber, channel){
		//console.log(subscriber); console.log(channel);		
		var test = permissions[channel][subscriber];
		return test===undefined? false: test;
	};


	return permissions;

});