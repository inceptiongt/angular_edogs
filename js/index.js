APP.controller("indexController",['$rootScope','$scope','$location','commonAjax','token','$timeout',function($rootScope,$scope,$location,commonAjax,token,$timeout){
	
	 // 判断是否登录 进行切换
	 if(token.get('login')){
	 	$scope.logined = true;
	 	$scope.myuser = token.get('login');
	 }else{
	 	$scope.logined = false;	
	 }
	 // 登录
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
	// 退出登录
	$scope.outlogin = function(){
		// 干掉token
		token.get('login',-1);
		$scope.logined = false;	
		// 清空密码
		$scope.password = '';
	}
	// 验证密码不能为空
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
	// 封装验证
	function yanzheng(){
		commonAjax("/InterFace/LoginInterFace.ashx",
			{
				"doType":"login",
				"CI_LoginName":$scope.userName,
				"CI_LoginPwd":$scope.password,

			},function(data){
				if(data.result==false){
					layer.msg(data.msg);
					$scope.logined = false;
				}else if(data.result==true){
					token.set("login",data.msg);
					$scope.myuser = data.msg;
					layer.msg("登入成功");
					$scope.logined = true;	
				}
			}
		)
	}

	// 分类数据
	$scope.cateDataAll = [];
	// 数据列表
	function getData(){
		commonAjax("/InterFace/MainPageInterFace.ashx",
			{
				"doType":"GetMainData",
			},function(data){
				$scope.MainRollimg = data.msg.MainRollimg;
				$scope.AllTypeList = data.msg.AllTypeList;
				$scope.CommodityList = data.msg.TypeCommodityList;
				
				// 将分类数据合并到CommodityList
				for(var i = 0; i < $scope.AllTypeList.length; i++){
					$scope.CommodityList[i].CommodityListLevel = $scope.AllTypeList[i].CommodityTypeLevel2	
				}
			}
		)
	}
	// 获取数据
	getData();
	// 分类鼠标移入
	$scope.enter = function(data){
		$scope.cateData = data.CommodityTypeLevel2;
		$scope.enterLeave = true;	
	}

	// 分类鼠标移出
	$scope.leave = function(){
		$scope.enterLeave = false;	
	}

	$scope.cateflag = false;
	$scope.toggleCateflag = function(){
		$scope.cateflag = !$scope.cateflag;
	}

	// 调用轮播
	$timeout(function() {
        jQuery(".slideBox").slide({mainCell:".bd ul",effect:"leftLoop",autoPlay:true});
	}, 2000);	

	$scope.$on('ngRepeatFinished',function(){
		$scope.cateindex = $('.cate-wrap .items').length > 5;
	})

}])