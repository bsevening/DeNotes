
	$(function(){
		var pass = password(8).toUpperCase();
		$('##generate').click(function(event){
			event.preventDefault();
			$("input[type='password']").val(pass);
		});
		var $validateUsername = $("##validateUsername");
		$('##username').keyup(function(){
			var t = this;
			
			if(this.value.length > 0){
				if(this.value != this.lastValue) {
					if(this.timer)clearTimeout(this.time);
					
					$validateUsername
						.removeClass('unavailable')
						.html('<img src="#event.getModuleRoot()#/includes/images/ajax-loader.gif" width="16"/> check availibility ...');
					
					this.timer = setTimeout(function(){
						$.ajax({
							url: '#event.buildLink("security.users.usernameExists")#/' + t.value,
							type: 'post',
							dataType: 'json',
							success: function(data){
								$validateUsername.html(data.msg).addClass( (data.exists == true) ? 'unavailable' : 'available');
								console.log(data.exists);
							},
							error : function(xhr,textStatus,errorThrown){
								$validateUsername
									.html('there was an error checking username status, please refresh the page')
									.removeClass('available')
									.removeClass('unavailable');								
							}
						});
					}, 200);
					this.lastValue = this.value
				}
			} else {
				$validateUsername
					.html('between 5-20 characters')
					.removeClass('available');
			}
		});
	});

	// I did not write this and I totally forgot where I got this from
	// my apologies to the author (and thank you)
	function password(length, special) {
		var iteration = 0;
		var password = "";
		var randomNumber;
		
		if(special == undefined){
			var special = false;
		}
		
		while(iteration < length){
			randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
			if(!special){
				if ((randomNumber >=33) && (randomNumber <=47)) { continue; }
				if ((randomNumber >=58) && (randomNumber <=64)) { continue; }
				if ((randomNumber >=91) && (randomNumber <=96)) { continue; }
				if ((randomNumber >=123) && (randomNumber <=126)) { continue; }
			}
			iteration++;
			password += String.fromCharCode(randomNumber);
		}
	
		return password;
	}	
