define(["namespace", 'jquery', 'use!underscore', 'use!backbone', 'aura/mediator', 'baseview'], 
function(namespace, $, _, Backbone, mediator, BaseView){
	
    var PaginatedView = namespace.module();
    
    PaginatedView.Views.PagingView = BaseView.extend({
		template: "includes/javascript/app/templates/serverpagination.html",
        tagName: 'div',
        className: 'paginator',
        id: 'paginator',	

		events: {
			'click a.servernext': 'nextResultPage',
			'click a.serverprevious': 'previousResultPage',
			'click a.orderUpdate': 'updateSortBy',
			'click a.serverlast': 'gotoLast',
			'click a.page': 'gotoPage',
			'click a.serverfirst': 'gotoFirst',
			'click a.serverpage': 'gotoPage',
			'click .serverhowmany a': 'changeCount'

		},

		initialize: function(options) {
	  		options || (options = {});
	  		this.collection = options.collection;
			//this.collection.on('reset', this.render, this);
			this.bindTo(this.collection, 'reset', this.render);
			//this.collection.on('change', this.render, this);
			this.bindTo(this.collection, 'change', this.render);
			$('#pagination').append(this.el);
		},

		render: function () {
			var that = this;
			var data = that.collection.info();
            // Fetch the template, render it to the View element and call done.
            namespace.fetchTemplate(this.template, function(tmpl){
                that.$el.html(tmpl(data));				                                              
            });
			
			//var html = this.template(this.collection.info());
			//this.$el.html(html);
		},

		updateSortBy: function (e) {
			e.preventDefault();
			this.resetNotes();
			var currentSort = $('#sortByField').val();
			this.collection.updateOrder(currentSort);
		},

		nextResultPage: function (e) {
			e.preventDefault();
			this.resetNotes();
			this.collection.requestNextPage();
		},

		previousResultPage: function (e) {
			e.preventDefault();
			this.resetNotes();
			this.collection.requestPreviousPage();
		},

		gotoFirst: function (e) {
			e.preventDefault();
			this.resetNotes();
			this.collection.goTo(this.collection.information.firstPage);
		},

		gotoLast: function (e) {
			e.preventDefault();
			this.resetNotes();
			this.collection.goTo(this.collection.information.lastPage);
		},

		gotoPage: function (e) {
			e.preventDefault();
			this.resetNotes();
			var page = $(e.target).text();
			this.collection.goTo(page);
		},

		changeCount: function (e) {
			e.preventDefault();
			this.resetNotes();			
			var per = $(e.target).text();
			this.collection.howManyPer(per);
		},
		
		resetNotes: function() {
			mediator.publish('pagerRemoveNotes');			
		},
		
		close: function(){
            this.dispose();
        }

	});
	
	return PaginatedView;

});