define(["namespace", // Libs
 "jquery", "use!underscore", "use!backbone"// Modules
// Plugins
], function(namespace, $, _, Backbone){

    // Create a new module
    var AccessView = namespace.module();
    
    // Shorthand the application namespace
    var app = namespace.app;
    
    // This will fetch the tutorial template and render it.
    AccessView.Views.LoginView = Backbone.View.extend({
        template: "/DeNotes/views/login.cfm",
        tagName: 'div',
        className: 'box shadow round-corners height-9',
        id: "loginBoxView",
        
        initialize: function(){
            _.bindAll(this, 'render', 'close');
            this.model.view = this;
        },
        
        render: function(done){
            var that = this;
            data = this.model.toJSON();
            
            // Fetch the template, render it to the View element and.
            namespace.fetchTemplate(this.template, function(tmpl){
                that.$el.append(tmpl(data));
            });
            return this;
        },
        
        events: {
            "submit #loginForm": "saveToModel",            
            "click span#newuserlink": "newUser",
			"click span#forgotpasswordlink": "userForgotPassword"
        },
        
        close: function(){
            this.remove();
            this.undelegateEvents();
            this.unbind();
        },
        
        userForgotPassword: function(event){
            app.loginController.userForgotPassword(event);
        },
        
        newUser: function(event){          
            app.loginController.newUser(event);
        },
        
        saveToModel: function(event){
            event.preventDefault();
            // this triggers a RESTFul POST (or PUT) request to the URL specified in the model
            this.model.login($("#username").val(), $("#password").val(), $("#rememberme").val());
        }
        
    });
    
    
    AccessView.Views.NewUserView = Backbone.View.extend({
        template: "includes/javascript/app/templates/newuser.html",
        tagName: 'div',
        className: 'box shadow round-corners',
        id: "newUserView",
        
        initialize: function(){
            _.bindAll(this, 'render', 'close');
        },
        
        pre_render: function(){
            var that = this;
            var dfd = namespace.fetchTemplate(this.template);
            
            return dfd;
        },
        
        render: function(tmpl){
            var that = this;
            data = this.model.toJSON();
            that.$el.append(tmpl(data));
            
            return this;
        },
        
        events: {
            'submit #newUserForm': 'createUser',
            'keyup #newusername': 'checkUserName'
        },
        
        close: function(){
            this.remove();
            this.undelegateEvents();
            this.unbind();
        },
        
        createUser: function(event){
            event.preventDefault();
            // this triggers a RESTFul POST (or PUT) request to the URL specified in the model
            var newUser = {
                firstName: $("#firstName").val(),
                lastName: $("#lastName").val(),
                userName: $("#newusername").val(),
                password: $("#newuserpassword").val(),
                email: $("#email").val()
            }
            this.model.set(newUser);
            this.model.createNewUser();
        },
        
        checkUserName: function(event){
        
            var $validateUsername = $("#validateUsername");
            
            var that = event.currentTarget;
            
            if (that.value.length > 0) {
                if (that.value != this.lastValue) {
                    if (that.timer) 
                        clearTimeout(this.time);
                    
                    $validateUsername.removeClass('unavailable').html('<img src="/DeNotes/modules/solitary/includes/images/ajax-loader.gif" width="16"/> check availibility ...');
                    
                    that.timer = setTimeout(function(){
                        $.ajax({
                            url: '/DeNotes/index.cfm/Remote_users/usernameExists/' + that.value,
                            type: 'post',
                            dataType: 'json',
                            success: function(data){
                                $validateUsername.html(data.msg).addClass((data.exists == true) ? 'unavailable' : 'available');                                
                            },
                            error: function(xhr, textStatus, errorThrown){
                                $validateUsername.html('there was an error checking username status, please refresh the page').removeClass('available').removeClass('unavailable');
                            }
                        });
                    }, 200);
                    that.lastValue = that.value
                }
            }
            else {
                $validateUsername.html('between 5-20 characters').removeClass('available');
            }
            
            
        }
        
    });
	
	AccessView.Views.ForgotPasswordView = Backbone.View.extend({
        template: "/DeNotes/views/forgotpassword.cfm",
        tagName: 'div',
        className: 'box shadow round-corners',
        id: "forgotPasswordView",
        
        initialize: function(){
            _.bindAll(this, 'render', 'close');
        },
        
        pre_render: function(){
            var that = this;
            var dfd = namespace.fetchTemplate(this.template);
            
            return dfd;
        },
        
        render: function(tmpl){
            var that = this;
            data = this.model.toJSON();
            that.$el.append(tmpl(data));
            
            return this;
        },        
        
        close: function(){
            this.remove();
            this.undelegateEvents();
            this.unbind();
        }       
        
    });
    
    // Required, return the module for AMD compliance
    return AccessView;
    
});
