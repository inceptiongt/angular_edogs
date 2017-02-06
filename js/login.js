APP.controller("loginCtrl",['$rootScope','$scope','$location','commonAjax','token',"$timeout",function($rootScope,$scope,$location,commonAjax,token,$timeout){
var itemId = window.location.search.substr('1');
$scope.login =function(){
	if(!$scope.userName){
		layer.msg("请输入用户名");
		return;
	}else if(!$scope.password){
		layer.msg("请输入密码");
		return;
	}	
	yanzheng()
}
$scope.mytrim=function(){
	// var reg2 = /^\S*$/;
	var reg = /^[0-9a-zA-Z]{6,16}$/;
	// if(reg2.test($scope.password)){
	// 	layer.msg("输入密码不符合要求(含有空格)");
	// }
	if(!reg.test($scope.password)){
		layer.msg("输入密码不符合要求");
		
	}
}
function yanzheng(){
	commonAjax("/InterFace/LoginInterFace.ashx",
		{
			"doType":"login",
			"CI_LoginName":$scope.userName,
			"CI_LoginPwd":$scope.password,

		},function(data){
			if(data.result==false){
				layer.msg(data.msg);
			}else if(data.result==true){
				token.set("login",data.msg);
				layer.msg("登入成功");
				$timeout(function(){
					if(itemId){
						window.location=itemId;
					}else{
						window.location.href="index.html";
					}
					}, 300)
				

			}
		}
	)
}
		
	


}])
