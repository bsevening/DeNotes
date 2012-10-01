/**
* handles application/json content type requests
*/
component {

	void function configure(){}

	void function preProcess(event,struct interceptData){
		var rc = event.getCollection();
		if(isJSONRequest())
		{	
			var jsonString = toString(getHttpRequestData().content);
			var jsonObject = deserializeJSON( jsonString );
			structAppend(rc,jsonObject,true);
		}	
	}	

	Boolean function isJSONRequest(){
		var contentType = getHTTPHeader("Content-Type","");
		return find("application/json",contentType) != 0;
	}

	function getHTTPHeader(header,defaultValue){

		var headers = getHttpRequestData().headers;

		if( structKeyExists(headers, arguments.header) ){
			return headers[arguments.header];
		}
		if( structKeyExists(arguments,"defaultValue") ){
			return arguments.defaultValue;
		}
		throw(message="Header #arguments.header# not found in HTTP headers",detail="Headers found: #structKeyList(headers)#",type="RequestContext.InvalidHTTPHeader");
	}


}