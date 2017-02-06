//   
var APP = angular.module("myapp",["ngRoute"]);

// 自定义date过滤器
APP.filter("mynumber",function(){
    return  function (value ,n ) {
			var date = new Date(parseInt(value)),
			YY = date.getFullYear()
			MM = date.getMonth()+1
			DD = date.getDate(),
			HH = date.getHours(),
			SS = date.getMinutes()
			if( MM <= 9) MM = '0'+MM
			if (DD <= 9) DD = '0'+DD
			if (HH <= 9) HH = '0'+HH
			if( SS <= 9) SS = '0'+SS
			return YY + '-'+ MM +'-'+ DD + " "+HH+'-'+SS
		  }

})

//个人中心的侧边栏点击样式
// APP.directive('asidecurrent',[function(){
//     return{
//         restrict:'A',
//         link:function(scope,element,attr){
          
//         }
//     }
// }])
APP.config(function($httpProvider){
        $httpProvider.defaults.transformRequest=function(obj){
              var str=[];
              for(var p in obj){
                  str.push(encodeURIComponent(p)+"="+encodeURIComponent(obj[p]));
              }
              return str.join("&");
        };
        $httpProvider.defaults.headers.post={
              'Content-Type':'application/x-www-form-urlencoded'
        }
});
// commonAjax
APP.service("commonAjax",function($http){
	commonAjax=function(_url,_data,_fn){
		layer.load(0, {shade: false})
		$http({
			url:"http://103.38.252.35:8888"+_url,
			method:'POST',
			data:_data,
			dataType:"json"
			}).success(function(res){
				layer.closeAll('loading');
				_fn(res)	
			}).error(function(data){
			//处理响应失败
				console.log("请求失败")
		});

	}

	return commonAjax
})
//token的服务
APP.service("token",[function(){
    return token ={
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
    
}]) 



//分页的服务
APP.service("pageFn",[function(){
    this.calculateIndexes =function(current, length, displayLength){
        var indexes = [];  
        var start = Math.round(current - displayLength / 2);  
        var end = Math.round(current + displayLength / 2);  
        if (start <= 1) {start = 1;end = start + displayLength - 1;  
           if (end >= length - 1){end = length - 1;}  
        }  
        if (end >= length - 1){end = length;start = end - displayLength + 1;  
           if (start <= 1) {start = 1;}  
        }  
        for (var i = start; i <= end; i++) {indexes.push(i);}  
        return indexes;  
    }
}]) 
//这个是日期的选择
APP.directive('defLaydate', ['$timeout',function($timeout) {
             return {
                 require: '?ngModel',
                 restrict: 'A',
                 scope: {
                     ngModel: '='
                 },
                 link: function(scope, element, attr, ngModel) {
                    
                     var _date = null,_config={};
                         // 初始化参数 
                     _config = {
                         elem: '#' + attr.id,
                         format: attr.format != undefined && attr.format != '' ? attr.format : 'YYYY-MM-DD',
                         max:attr.hasOwnProperty('maxDate')?attr.maxDate:'',
                         min:attr.hasOwnProperty('minDate')?attr.minDate:'',
                         choose: function(data) {
                              scope.$apply(setVeiwValue);
                         },

                         clear:function(){
                            ngModel.$setViewValue(null);
                         }
                     };
                     // 初始化
                      _date= laydate(_config);
 
                    // 监听日期最大值
                     if(attr.hasOwnProperty('maxDate')){
                         attr.$observe('maxDate', function (val) {
                             _config.max = val;
                         })
                     }
                     // 监听日期最小值
                     if(attr.hasOwnProperty('minDate')){
                        attr.$observe('minDate', function (val) {
                             _config.min = val;
                         })
                     }
                     // 模型值同步到视图上
                     ngModel.$render = function() {
                         element.val(ngModel.$viewValue || '');
                     };
 
                     // 监听元素上的事件
                     element.on('keyup change blur', function() {
                         scope.$apply(setVeiwValue );
                     });
                     element.on('focus', function() {
                         laydate(_config);
                     });
                    $timeout(setVeiwValue,300);
                    $timeout(function(){
                             element.parents('body').find('#laydate_box').hide();
                    }, 10);
                   
                     // 更新模型上的视图值
                     function setVeiwValue() {
                         var val = element.val();
                         ngModel.$setViewValue(val);
                     }
                 }  
             }




 }])

// 这个是自定义当repeat指令完成后执行的指令
APP.directive('onFinishRender',function(){
    return {
    	restrict: 'A',
        link: function(scope,element,attr){
            if(scope.$last == true){
                scope.$emit('ngRepeatFinished');
            }
        }
    }
})

