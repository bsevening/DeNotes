component extends="coldbox.system.orm.hibernate.VirtualEntityService" singleton {
	
	//property name="roleService"	inject="model:roleService@solitary";
	
	public NoteService function init(){
		super.init(entityName="Note");
		return this;
	}
	
	public string function getTitle(note) {
		var cleanedNote = stripHTML(note);
	  	var words = ListToArray(cleanedNote, chr(32));
	  	var wordArray = arrayNew(1);
	  	var wordsLen = 0;
	  	var l = arrayLen(words);
	  	for (var i = 1; i lte l; i = i + 1) 
	  	{
	    	wordsLen = wordsLen + len(words[i]) + 1;
	    	if (wordsLen LT 120) {
	    		var temp = arrayAppend(wordArray, words[i]);
	    	} else {
	    		break;
	    	}
	  	}
	  	
	  	var strippedTitle = arrayToList(wordArray, chr(32));
	  	
	  	if (arrayLen(wordArray) LT l)
	  		 strippedTitle = strippedTitle & " ...";
	  		 
	  	return strippedTitle;	
	}
	
	public string function stripHTML(str) {
	    str = reReplaceNoCase(str, "<*style.*?>(.*?)</style>","","all");
	    str = reReplaceNoCase(str, "<*script.*?>(.*?)</script>","","all");
	
	    str = reReplaceNoCase(str, "<.*?>","","all");
	    //get partial html in front
	    str = reReplaceNoCase(str, "^.*?>","");
	    //get partial html at end
	    str = reReplaceNoCase(str, "<.*$","");
	    return trim(str);
	}
}