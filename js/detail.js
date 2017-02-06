/*
* @Author: Administrator
* @Date:   2017-01-26 09:34:03
* @Last Modified by:   Administrator
* @Last Modified time: 2017-01-30 18:26:49
*/

APP.controller('detailController',['$rootScope','$scope','$location','commonAjax','token','$timeout',function($rootScope,$scope,$location,commonAjax,token,$timeout){
	$scope.msg =token.get('login');
	var itemId = window.location.search.substr('1');
	$scope.itemId = itemId;
	function getData(){
		commonAjax("/InterFace/CommodityInterFace.ashx",
			{
				"doType":"getDetail",
				"CI_ID" : itemId

			},function(data){
				console.log(data)
				var imgList = data.msg;
				$scope.detailMsgh=data.msg;
				$scope.smallImg = data.msg.CI_ImgUrlMin.split(',');
				$scope.bigImg = data.msg.CI_ImgUrl.split(',');
			}
		)
	}
	getData();

	$scope.$on('ngRepeatFinished',function(){
		// 图片上下滚动
	    var count = $("#imageMenu li").length - 5; /* 显示 6 个 li标签内容 */
	    var interval = $("#imageMenu li:first").width();
	    var curIndex = 0;
	    //点击到中图
	    var midChangeHandler = null;
	    $("#imageMenu li").eq(0).attr("id","onlickImg");
	    $("#imageMenu li").bind("mouseenter", function(){
	        if ($(this).attr("id") != "onlickImg") {
	            midChange('http://103.38.252.35:8888' + $scope.bigImg[$(this).data("index")]);
	            $("#imageMenu li").removeAttr("id");
	            $(this).attr("id", "onlickImg");
	        }
	    }).bind("mouseleave", function(){
	        if($(this).attr("id") != "onlickImg"){
	            $(this).removeAttr("style");
	            midChange('http://103.38.252.35:8888' + $scope.bigImg[$(this).data("index")]);
	        }
	    });
	    function midChange(src) {
	        $("#midimg").attr("src", src);
	        changeViewImg(src);
	    }
	    //大视窗看图
	    function mouseEnter(e) {
	        if ($("#winSelector").css("display") == "none") {
	            $("#winSelector,#bigView").show();
	        }
	        $("#winSelector").css(fixedPosition(e));
	    }

	    function mouseLeave(e) {
	        if ($("#winSelector").css("display") != "none") {
	            $("#winSelector,#bigView").hide();
	        }
	    }
	   
	    $("#midimg").mouseenter(mouseEnter); //中图事件
	    $("#midimg,#winSelector").mousemove(mouseEnter).mouseleave(mouseLeave); //选择器事件

	    var $divWidth = $("#winSelector").width(); //选择器宽度
	    var $divHeight = $("#winSelector").height(); //选择器高度
	    var $imgWidth = $("#midimg").width(); //中图宽度
	    var $imgHeight = $("#midimg").height(); //中图高度
	    var $viewImgWidth = $viewImgHeight = $height = null; //IE加载后才能得到 大图宽度 大图高度 大图视窗高度

	    function changeViewImg(src) {
	        $("#bigView img").attr("src", src);
	    }
	    $("#bigView").scrollLeft(0).scrollTop(0);
	    function fixedPosition(e) {
	        if (e == null) {
	            return;
	        }
	        var $imgLeft = $("#midimg").offset().left; //中图左边距
	        var $imgTop = $("#midimg").offset().top; //中图上边距
	        X = e.pageX - $imgLeft - $divWidth / 2; //selector顶点坐标 X
	        Y = e.pageY - $imgTop - $divHeight / 2; //selector顶点坐标 Y
	        X = X < 0 ? 0 : X;
	        Y = Y < 0 ? 0 : Y;
	        X = X + $divWidth > $imgWidth ? $imgWidth - $divWidth : X;
	        Y = Y + $divHeight > $imgHeight ? $imgHeight - $divHeight : Y;

	        if ($viewImgWidth == null) {
	            $viewImgWidth = $("#bigView img").outerWidth();
	            $viewImgHeight = $("#bigView img").height();
	            if ($viewImgWidth < 200 || $viewImgHeight < 200) {
	                $viewImgWidth = $viewImgHeight = 800;
	            }
	            $height = $divHeight * $viewImgHeight / $imgHeight;
	            $("#bigView").width($divWidth * $viewImgWidth / $imgWidth);
	            $("#bigView").height($height);
	        }
	        var scrollX = X * $viewImgWidth / $imgWidth;
	        var scrollY = Y * $viewImgHeight / $imgHeight;
	        $("#bigView img").css({ "left": scrollX * -1, "top": scrollY * -1 });
	        $("#bigView").css({ "top": 75, "left": $(".preview").offset().left + $(".preview").width() + 15 });

	        return { left: X, top: Y };
	    }
	})
	$scope.productmassage = token.get("productmassage") || {};
	$scope.xunjia=function(){
		if(!token.get("login")){
			layer.confirm('您当前未登入，是否登入？', {
                  btn: ['确定','取消'] //按钮
                }, function(){
                    window.location.href="login.html?"+window.location.href
                }, function(){
                   layer.close();
                   $scope.productmassage[$scope.itemId] = $scope.detailMsgh;
                   $scope.productmassage[$scope.itemId].Count = 1;
                   $scope.productmassage[$scope.itemId].CI_ImgUrl = $scope.smallImg[0];
                   token.set('productmassage',$scope.productmassage)

                });
		}else{
			
		 commonAjax("/InterFace/InquireOrderBaseInterFace.ashx",{
                            doType:"addInquireItem",
                            CI_ID:$scope.msg.CI_ID,
                            Commodity_ID:itemId,
                            IB_Count:"1"
                        },function(data){
                            if(data.result){
                                layer.msg("询价成功");
                            }else{
                                layer.msg("询价失败");
                            }
                        })  
		 }
	}

}])