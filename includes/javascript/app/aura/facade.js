define([ "../aura/mediator" , "../aura/permissions" ], function (mediator, permissions) {

	var facade = facade || {};

	facade.subscribe = function (subscriber, channel, callback) {
        if (permissions.validate(subscriber, channel)) {
            mediator.subscribe(channel, callback, this);
        }
    };

	facade.publish = function(channel){
		mediator.publish( channel );
	}
	return facade;

});