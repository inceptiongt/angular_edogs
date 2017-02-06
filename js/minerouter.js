APP.config(['$routeProvider',function($routeProvider){
	$routeProvider
	.when("/",{
		templateUrl:"/templates/myorder.html",   //	我的订单
		 controller:"orderCtrl"
	})
	.when("/enquiry",{
		templateUrl:"/templates/enquiry.html",   //	我的询价单
		 controller:"enquiryCtrl"
	})
	.when("/enquiryDetail/:orderno",{
		templateUrl:"/templates/enquiryDetail.html",   //	我的询价单详情
		 controller:"enquiryDetail"
	})
	.when("/logistics/:orderno",{
		templateUrl:"/templates/logistics.html",   //	我的物流
		 controller:"logisticsCtrl"
	})
	.when("/changepassword",{
		templateUrl:"/templates/changepassword.html",   //	我的修改密码
		 controller:"changepasswordCtrl"
	})
	.when("/changemassage",{
		templateUrl:"/templates/changemassage.html",   //	我的修改信息
		 controller:"changemassageCtrl"
	})
	
}])