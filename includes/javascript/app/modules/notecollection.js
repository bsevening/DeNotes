define([
  "namespace",
  'use!underscore', 
  'use!backbone',  
  'modules/notemodel',
  'paginator'
  ], function(namespace, _, Backbone, NoteModel, paginator){
  	
	var NoteCollection = namespace.module();
	  
	NoteCollection.Collection = paginator.requestPager.extend({ 

	    // Reference to this collection's model.
	    model: NoteModel.Model,
		
		initialize: function(options) {
            options || (options = {});
            this.userid = options.userid;
			//_.bindAll(this, 'url');
        },		
		
		paginator_core: {
			// the type of the request (GET by default)
			type: 'GET',
			
			// the type of reply (jsonp by default)
			dataType: 'json',
		
			// the URL (or base URL) for the service
			url: function(){
				return 'http://servermachine.bsevening.com/DeNotes/index.cfm/note/' + this.userid
			}
		},
		
		paginator_ui: {
			// the lowest page index your API allows to be accessed
			firstPage: 1,
		
			// which page should the paginator start from 
			// (also, the actual page the paginator is on)
			currentPage: 1,
			
			// how many items per page should be shown
			perPage: 3,
			
			sortField:'dateCreated',
			
			// a default number of total pages to query in case the API or 
			// service you are using does not support providing the total 
			// number of pages for us.
			// 10 as a default in case your service doesn't return the total
			totalPages: 10
		},
		
		server_api: {
			// the query field in the request
			//'$filter': '',
			
			// number of items to return per request/page
			'rows': function() { return this.perPage },
			
			'page': function() { return this.currentPage },
			
			// how many results the request should skip ahead to
			// customize as needed. For the Netflix API, skipping ahead based on
			// page * number of results per page was necessary.
			//'$skip': function() { return this.currentPage * this.perPage },
			
			// field to sort by
			'orderby': function() {
				if(this.sortField === undefined)
					return 'dateCreated';
				return this.sortField;
			},

			
			// what format would you like to request results in?
			'format': 'json',
			
			// custom parameters
			//'$inlinecount': 'allpages',
			//'$callback': 'callback'                                     
		},

		parse: function (response) {
			// Be sure to change this based on how your results
			// are structured (e.g d.results is Netflix specific)
			var notes = response.data.data;
			//Normally this.totalPages would equal response.d.__count
			//but as this particular NetFlix request only returns a
			//total count of items for the search, we divide.
			if (this.perPage > response.count)
				this.totalPages = 1;
			else
				this.totalPages = Math.ceil(response.count / this.perPage);

			this.totalRecords = parseInt(response.count);
			return notes;
		}
	
	  });
  return NoteCollection;
});
