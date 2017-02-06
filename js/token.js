
// var token = {
// 	set : function(key,value){  
// 		var that = this;
		
// 		$.cookie(key,value);
// 		alert($.cookie(key));
// 	},
// 	get : function(key,during){
		
// 		during = during ? during : 1;
// 		if(during == -1){
// 			$.removeCookie(key);
// 			return -1;
// 		}else{
// 			return $.cookie(key);
// 		}
		
// 	}
	
// }

// module.exports = token;

var token = {
	set : function(key,value){  
		var that = this;
		if(window.localStorage){
        	localStorage.setItem(key,JSON.stringify(value));
		}else{
			if(key=="Loginer"){
				document.cookie=key+"="+value;
			}else{
				that.setCookie(key,value);
			}
			
		}
	},
	get : function(key,during){
		during = during ? during : 1;
		var that = this;
		if(window.localStorage){
			var data = localStorage.getItem(key);
	        var dataObj = JSON.parse(data);
	        if (during == -1) {  //token已过期
	            localStorage.removeItem(key);
	            return -1;
	        }else{
	            return dataObj;
	        }
		}else{
			if(during == -1){   //删除cookie
				that.clearCookie(key);
				return -1;  
			}else{
				var val = that.getCookie(key);
				return val;
			}
		}
	},
	setCookie : function(cname, cvalue, exdays) {
	    var d = new Date();
	    exdays = exdays || Number.MAX_VALUE;
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires +";domain="+window.location.origin;
	},

	getCookie : function(key) {
	    var strCookie = document.cookie;
	    var arrCookie = strCookie.split("; ");
	    for(var i = 0; i < arrCookie.length; i++){
	        var arr = arrCookie[i].split("=");
	        if(key == arr[0]){
	            return arr[1];
	        }
	    }
	    return "";
	},

	//清除cookie  
	clearCookie : function(name) {  
	    this.setCookie(name, "", -1);  
	} 
}

