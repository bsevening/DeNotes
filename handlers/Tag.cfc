component accessors="true" {

	property name="tagService"	inject="TagService";
	//property name="roleService"	inject="model:roleService@solitary";
	property name="sessionStorage"	inject="coldbox:plugin:SessionStorage";
	property name="noteTagsService"	inject="NoteTagsService";

	function preHandler(event,action){
		
	}
	
	public void function save(event){
		requestBody = toString( getHttpRequestData().content ) ;
 		//if (isJSON( requestBody ))
 			//writeDump("#deserializeJSON( requestBody )#"); 
 			
 		//abort;
 
		var data = deserializeJSON( requestBody );
		//writeDump(data);writeDump(data["id"]);abort;
		var tag = tagService.get(data["id"]);
		tag.settagname(data["tagname"]);	
		tagService.save(tag);
		event.renderData(type="json",data=data,jsonQueryFormat="array");
	}
	
	public void function create(event){
		requestBody = toString( getHttpRequestData().content ) ;
 		//if (isJSON( requestBody ))
 			//writeDump("#deserializeJSON( requestBody )#"); 
 			
 		//abort;
 
		//var rc = event.getCollection();
		//writeDump("#arguments#");abort;
		var tag = tagService.new(entityName="Tag");
		var data = tagService.populate(tag, deserializeJSON( requestBody ));
		tagService.save(tag);
		event.renderData(type="json",data=data,jsonQueryFormat="array");
	}
	
	public void function getTags(event){
		var rc = event.getCollection();
		var u_tags = "";
		rc.currentUser = sessionStorage.getVar('user');
		var queryService = getQueryService("u_tags"); 
		
		//filters 
		if( structKeyExists(rc,"id") AND structKeyExists(rc,"userid")){
			queryService.addParam(name="id", value="#rc.id#", cfsqltype="cf_sql_bigint");
			queryService.addParam(name="userid", value="#rc.userid#", cfsqltype="cf_sql_varchar");
				results = queryService.execute(sql="SELECT t.tagid as id, t.tagname as tagname, t.userid as userid, nt.noteid as noteid 
				FROM tag as t 
				LEFT OUTER JOIN notetags as nt ON (nt.noteid = :id) and (t.tagid = nt.tagid)  
				WHERE (t.userid = :userid)    
				ORDER BY t.tagname ASC");
			u_tags = results.getResult();  
		
		} else if( structKeyExists(rc,"id") ){
			queryService.addParam(name="userid", value="#rc.id#", cfsqltype="cf_sql_varchar");			
				results = queryService.execute(sql="SELECT t.tagid as id, t.tagname as tagname, count(nt.tagid) as tagcount, t.userid as userid 
				FROM tag as t 
				INNER JOIN notetags as nt ON t.tagid = nt.tagid
				INNER JOIN note as n ON n.noteid = nt.noteid  
				WHERE (n.userid = :userid)   
				GROUP BY nt.tagid ORDER BY t.tagname ASC");
			u_tags = results.getResult();
						
		} else {
			u_tags = tagService.list(sortOrder="tagname asc",asQuery=true);
		}
		//writeDump("#u_tags#");abort;
	    event.renderData(type="json",data=u_tags,jsonQueryFormat="array");
	}

	public void function edit(event){
		var rc = event.getCollection();
		event.paramValue("id","");
		rc.user  = event.getValue("user",userService.get( rc.id ));
		rc.roles = roleService.list(sortOrder="name",asQuery=false);
	}	
	
	public void function remove(event){
		var rc = event.getCollection();
		tagService.deleteWhere(entityName="Tag", id=rc.id, userid=rc.userID);
		noteTagsService.deleteWhere(entityName="NoteTags", tagid=rc.id);
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

}








