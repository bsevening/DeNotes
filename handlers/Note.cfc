component accessors="true" {

	property name="noteService"	inject="NoteService";
	property name="noteTagsService"	inject="NoteTagsService";
	property name="noteTag"	inject="NoteTag";
	property name="sessionStorage"	inject="coldbox:plugin:SessionStorage";

	function preHandler(event,action){
		
	}
	
	public void function save(event){
		requestBody = toString( getHttpRequestData().content ) ;
 		//if (isJSON( requestBody ))
 			//writeDump("#deserializeJSON( requestBody )#"); 
 			
 		//abort;
 
		var data = deserializeJSON( requestBody );
		//writeDump(data);writeDump(data["id"]);abort;
		var note = noteService.get(data["id"]);
		var strippedTitle = noteService.getTitle(data["note"]);
		
		note.settitle(strippedTitle);
		note.setnote(data["note"]);
		note.setuserid(data["userid"]);
		var tags = data["notetags"];
		noteTagsService.deleteWhere(noteid=data["id"]);
		for(i=1; i <= ArrayLen(tags); i++){
			var nt = noteTagsService.new();
    		nt.settagid(tags[i]);
			nt.setnoteid(data["id"]);
			noteTagsService.save(nt);			
		}
		
		noteService.save(note);
		var u_notes = noteService.executeQuery("from Note where id = :arg order by id desc",{arg=data["id"]},0,0,0,true);
		event.renderData(type="json",data=u_notes,jsonQueryFormat="array");
	}
	
	public void function create(event){
		requestBody = toString( getHttpRequestData().content ) ;
 		//if (isJSON( requestBody ))
 			//writeDump("#deserializeJSON( requestBody )#"); 
 			
 		//abort;
 
		//var rc = event.getCollection();
		//writeDump("#rc#");abort;
		var newNote = noteService.new(entityName="Note");
		var data = deserializeJSON( requestBody );
		newNote.setnote(data["note"]);
		newNote.setuserid(data["userid"]);
		//noteService.populate(newNote, data, "note,userid" );
		//writeDump(newNote);abort;
		noteService.save(newNote);
		event.renderData(type="json",data=newNote,jsonQueryFormat="array");
	}
	
	public void function getNotes(event){
		var rc = event.getCollection();
		var u_notes = "";
		var u_notes2 = "";
		rc.currentUser = sessionStorage.getVar('user');
		var queryService = getQueryService("u_notes");
		var queryService2 = getQueryService("u_notes_count");
		
		//writeDump("#rc#");abort;
		var results = "";
		var results2 = "";
		var qstruct = structNew();
		
		//filters
		if( structKeyExists(rc,"id") and structKeyExists(rc,"tagid") ) {
			queryService.addParam(name="tagid", value="#rc.tagid#", cfsqltype="cf_sql_bigint");
			queryService.addParam(name="userid", value="#rc.id#", cfsqltype="cf_sql_varchar");
			
			queryService2.addParam(name="tagid", value="#rc.tagid#", cfsqltype="cf_sql_bigint");
			queryService2.addParam(name="userid", value="#rc.id#", cfsqltype="cf_sql_varchar");
			
			var start = (rc.rows * rc.page) - rc.rows;
			var limit = "LIMIT #start#, #rc.rows#";
			var sort = "ORDER BY n." & rc.orderby; 	
			
			results = queryService.execute(sql="Select n.noteid as id, n.title as title, n.userid as userid from note n 
			JOIN notetags nt where n.noteid = nt.noteid and n.userid = :userid and nt.tagid = :tagid 
				#sort# 
				#limit#");
			
			results2 = queryService2.execute(sql="Select count(n.noteid) as totalcount from note n 
				JOIN notetags nt where n.noteid = nt.noteid and n.userid = :userid and nt.tagid = :tagid");
			
			u_notes = results.getResult();
			u_notes2 = results2.getResult();
			qstruct.count = u_notes2.TOTALCOUNT;
			qstruct.data = u_notes;
			 
		} else if( structKeyExists(rc,"id") ){			
			
			queryService.addParam(name="id", value="#rc.id#", cfsqltype="cf_sql_varchar");			
			queryService2.addParam(name="nid", value="#rc.id#", cfsqltype="cf_sql_varchar");
			
			if (isNumeric(rc.id)) {
				results = queryService.execute(sql="Select n.noteid as id, n.note as note, n.userid as userid from note n 
				where n.noteid = :id");
								
				u_notes = results.getResult();				
				qstruct.data = u_notes;
				
			} else {
				var start = (rc.rows * rc.page) - rc.rows;
				var limit = "LIMIT #start#, #rc.rows#";
				var sort = "ORDER BY n." & "#rc.orderby#";
				 	 
				results = queryService.execute(sql="Select n.noteid as id, n.title as title, n.userid as userid from note n 
				where n.userid = :id #sort# #limit#");
				
				results2 = queryService2.execute(sql="Select count(n.noteid) as totalcount from note n 
				where n.userid = :nid");
				
				u_notes2 = results2.getResult();
				u_notes = results.getResult();
				qstruct.count = u_notes2.TOTALCOUNT;
				qstruct.data = u_notes;
			}
									
		} 
				
	    event.renderData(type="json",data="#qstruct#",jsonQueryFormat="array");
	}

	public void function edit(event){
		var rc = event.getCollection();
		event.paramValue("id","");
		rc.user  = event.getValue("user",userService.get( rc.id ));
		rc.roles = roleService.list(sortOrder="name",asQuery=false);
	}	

	public void function remove(event){
 		
 		var rc = event.getCollection();
		noteService.deleteWhere(entityName="Note", id=rc.id);
		noteTagsService.deleteWhere(entityName="NoteTags", noteid=rc.id);
		successString = "{'success': true}";
		event.renderData(type="json",data=successString,jsonQueryFormat="array");
		
	}
	
	public any function getQueryService(name){
 		var queryService = new query(); 
		/* set properties using implict setters */ 
		queryService.setDatasource("DeNotes"); 
		queryService.setName(name);
 		
 		return queryService;
	}
	
	function queryToStructOfArrays(q){
		//a variable to hold the struct
		var st = structNew();
		//two variable for iterating
		var ii = 1;
		var cc = 1;
		//grab the columns into an array for easy looping
		var cols = listToArray(q.columnList);
		//iterate over the columns of the query and create the arrays of values
		for(ii = 1; ii lte arrayLen(cols); ii = ii + 1){
			//make the array with the col name as the key in the root struct
			st[cols[ii]] = arrayNew(1);
			//now loop for the recordcount of the query and insert the values
			for(cc = 1; cc lte q.recordcount; cc = cc + 1)
				arrayAppend(st[cols[ii]],q[cols[ii]][cc]);
		}
		//return the struct
		return st;
	}

	
	public any function QueryToArrayOfStructures(theQuery){
	    var theArray = arraynew(1);
	    var cols = ListtoArray(theQuery.columnlist);
	    var row = 1;
	    var thisRow = "";
	    var col = 1;
	    for(row = 1; row LTE theQuery.recordcount; row = row + 1){
	        thisRow = structnew();
	        for(col = 1; col LTE arraylen(cols); col = col + 1){
	            thisRow[cols[col]] = theQuery[cols[col]][row];
	        }
	        arrayAppend(theArray,duplicate(thisRow));
	    }
	    return(theArray);
	}
	
	function StructOfArraysToQuery(thestruct){
	   var fieldlist = structkeylist(thestruct);
	   var numrows   = arraylen( thestruct[listfirst(fieldlist)] );
	   var thequery  = querynew(fieldlist);
	   var fieldname="";
	   var thevalue="";
	   var row=1;
	   var col=1;
	   for(row=1; row lte numrows; row = row + 1)
	   {
	      queryaddrow(thequery);
	      for(col=1; col lte listlen(fieldlist); col = col + 1)
	      {
	     fieldname = listgetat(fieldlist,col);
	     thevalue  = thestruct[fieldname][row];
	     querysetcell(thequery,fieldname,thevalue);
	      }
	   }
	return(thequery); }	
	}