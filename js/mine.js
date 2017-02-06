
APP.controller("allCtrl",['$rootScope','$scope','$location','commonAjax','token',"$timeout","$routeParams",function($rootScope,$scope,$location,commonAjax,token,$timeout,$routeParams){
     $rootScope.yiji = "订单中心";
    $rootScope.erji = "我的订单"; 
     $rootScope.mymsg =token.get('login');
        if($rootScope.mymsg){
            $rootScope.CI_ID=$rootScope.mymsg.CI_ID;
        } 
    commonAjax("/InterFace/MainPageInterFace.ashx",{
            doType:"GetMainData",
    },function(data){
            // console.log(data,);
            $scope.items=data.msg.AllTypeList ;
    });
}])
//我的订单
 APP.controller("orderCtrl",['$rootScope','$scope','$location','commonAjax','token',"$timeout",'pageFn',function($rootScope,$scope,$location,commonAjax,token,$timeout,pageFn){
    $rootScope.yiji = "订单中心";
    $rootScope.erji = "我的订单";
    $scope.zhuangtai = "全部状态";
    $scope.all_page = '';
    function orderListInit(){
        commonAjax("/InterFace/OrderInfoInterFace.ashx",{
        doType:"getList",
        CI_ID:$rootScope.CI_ID,
        timeS:$scope.timeStart || "",
        timeE:$scope.timeEnd || "",
        orderNo:$scope.orderNo || "",
        zhuangtai:$scope.zhuangtai 
    },function(data){
        //console.log(data)
        if(data.result){
            if(data.msg.RtnList.length>0){
                $scope.item = data.msg.RtnList;
                $scope.all_page = data.msg.PageSize;
                reloadPno(1);
            }else{
               $scope.item2 = data.msg.RtnList; 
            }
        }
    })   
    }
    //查询点击
    $scope.update=function(){
        orderListInit();
    }
    //初始化
    orderListInit()

    $scope.current = 1;
    // ////////////////////////////////////////////////////
    $scope.p_prv = function(){
        $scope.current <= 1 ? $scope.current=1:$scope.current--;
         if($scope.current<1 || $scope.current > $scope.all_page){
            return;
        }
        $scope.load_page($scope.current);  
    }  
    //下一页  
    $scope.p_next = function(){
         
        $scope.current >= $scope.all_page ? $scope.current=$scope.all_page:$scope.current++;
        if($scope.current<1 || $scope.current > $scope.all_page){
            return;
        }
        $scope.load_page($scope.current);  
    }  
    //加载某一页 

    $scope.p_page = function(page){ 
        $scope.current=page 
        $scope.load_page(page);

    }; 
    function pageK(current){
        $scope.pages.forEach(function(tt){
        $scope["p"+tt]=false;
      })
      $scope["p"+current]=true;
    } 
    //分页 
    var reloadPno = function(current){  
        $scope.pages=pageFn.calculateIndexes(current,$scope.all_page,5); 
    }; 
        

$scope.load_page = function (current) {  
        if(current<1 || current > $scope.all_page){
            return;
        }
      $scope.pages.forEach(function(tt){
        // console.log(tt)
        $scope["p"+tt]=false;
      })
        $scope["p"+current]=true;
        $scope.currentP = current;
        //alert(current)
        reloadPno(current)
        //getdata($scope.dadyS,$scope.dadyT,chooseStr,current)
    };
$scope.load_page(1)






}])
//我的询价单
APP.controller("enquiryCtrl",['$rootScope','$scope','$location','commonAjax','token',"$timeout",function($rootScope,$scope,$location,commonAjax,token,$timeout){
    $rootScope.yiji = "订单中心";
   $rootScope.erji = "我的询价单";
    $scope.zhuangtai = "全部状态"
    function orderListInit(){
        commonAjax("/InterFace/InquireOrderInfoInterFace.ashx",{
        doType:"getList",
        CI_ID:$rootScope.CI_ID,
        timeS:$scope.timeStart || "",
        timeE:$scope.timeEnd || "",
        // orderNo:$scope.orderNo || "",
        // zhuangtai:$scope.zhuangtai 
        PageIndex:1,
        PageSize:5
    },function(data){
         console.log(data,33)
        if(data.result){
            if(data.msg.RtnList.length>0){
                $scope.item = data.msg.RtnList;
            }else{
               $scope.item2 = data.msg.RtnList; 
            }
            
        }
    })   
    }
    //查询点击
    $scope.update=function(){
        orderListInit();
    }
    //初始化
    orderListInit()



    $scope.p=[];
    $scope.delateli=function(id,i){
        commonAjax("/InterFace/InquireOrderInfoInterFace.ashx",{
        doType:"delete",
        IOID_IOIID:id
    },function(data){
        if(data.result){
            layer.msg("删除成功");
            $scope.p[i]=true;
            
        }
    }) 
    }

}])
//修改密码
APP.controller("changepasswordCtrl",['$rootScope','$scope','$location','commonAjax','token',"$timeout",function($rootScope,$scope,$location,commonAjax,token,$timeout){
     $rootScope.yiji = "账户设置";
    $rootScope.erji = "修改密码";
    $scope.save=function(){
        if($scope.newpassword.length>=6 && $scope.newpassword.length<=10){
            $scope.msg="ruo";
            return
        }
        if($scope.newpassword.length>10 && $scope.newpassword.length<=15){
             $scope.msg="zhong";
            return
        }
        if($scope.newpassword.length==16){
             $scope.msg="qiang";
            return
        }
    }
    $scope.changepassword=function(){
        var reg = /^[0-9a-zA-Z]{6,16}$/;
        if(!reg.test($scope.oldpassword) || !$scope.oldpassword){
            layer.msg("输入旧密码不符合要求");
            return;
        }
        if(!reg.test($scope.newpassword) || !$scope.newpassword){
            layer.msg("输入新密码不符合要求");
            return;
        }
        if($scope.dblpassword!=$scope.newpassword || !$scope.dblpassword){
            layer.msg("两次输入的密码不一致");
            return;
        }
        if($scope.msg=="ruo"){
              layer.confirm('您当前设置的密码为弱，是否修改？', {
                  btn: ['确定','取消'] //按钮
                }, function(){
                    commonAjax("/InterFace/ClienteleInfoInterFace.ashx",{
                            doType:"resetPwd",
                            CI_ID:$rootScope.CI_ID,
                            CI_LoginPwd:$scope.newpassword,      //xinmima
                            jiumima:$scope.oldpassword
                        },function(data){
                            if(data.result){
                                layer.msg("修改密码成功");
                            }else{
                                layer.msg("修改密码失败");
                            }
                        })   

                }, function(){
                   layer.close()
                });
        }
        
    }
}])
//修改个人信息
APP.controller("changemassageCtrl",['$rootScope','$scope','$location','commonAjax','token',"$timeout",function($rootScope,$scope,$location,commonAjax,token,$timeout){
    $rootScope.yiji = "账户设置";
    $rootScope.erji = "修改个人信息";
    $scope.msg =token.get('login');
    $scope.surechange=function(){
        if(!$scope.msg.CI_Name){
            layer.msg("请填写真实姓名");
            return
        }
         if(!$scope.msg.CI_CompanyName){
            layer.msg("请填写公司名称");
            return
        }
         if(!$scope.msg.CI_MobilePhoneNo || !/^1[3|4|5|8][0-9]\d{4,8}$/.test($scope.msg.CI_MobilePhoneNo)){
            layer.msg("请填写正确的手机号码");
            return
        }
        if(!$scope.msg.CI_DeliveryAddress){
            layer.msg("请填写送货地址");
            return
        }
        if($scope.msg.CI_Email){
            if(!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($scope.msg.CI_Email)){
               layer.msg("请正确的邮箱");
                return 
            }
        }
        // if($scope.quhao){
        //     if(!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($scope.msg.CI_Email)){
        //        layer.msg("请正确的邮箱");
        //         return 
        //     }
        // }
        //商量分三个字段给他
        $scope.msg.gudingTel=$scope.quhao+$scope.ph+$scope.fenji;
         commonAjax("/InterFace/ClienteleInfoInterFace.ashx",{
                doType:"updateinfo",   //必传参数 参数值为定值
                CI_ID:$rootScope.CI_ID,               //当前登录用户id
                CI_Name:$scope.msg.CI_Name,            //真实姓名
                CI_Sex:$scope.msg.CI_Sex,              //性别（0：女；1：男）
                CI_CompanyName:$scope.msg.CI_CompanyName,     //公司名称
                CI_PhoneNo:$scope.gudingTel || '',         //联系电话(固话)
                CI_MobilePhoneNo:$scope.msg.CI_MobilePhoneNo,   //联系电话(手机)
                CI_Email:$scope.msg.CI_Email || "",           //邮箱地址
                CI_DeliveryAddress:$scope.msg.CI_DeliveryAddress,    //收货地址
        },function(data){
            if(data.result){
                layer.msg("修改个人信息成功");
                token.set("login",$scope.msg)
            }else{
                layer.msg("修改个人信息失败");
            }
        })   



    }
}])
// 订单详情
APP.controller("logisticsCtrl",['$rootScope','$scope','$location','commonAjax','token',"$timeout","$routeParams",function($rootScope,$scope,$location,commonAjax,token,$timeout,$routeParams){
    console.log($routeParams.orderno)
    commonAjax("/InterFace/OrderInfoInterFace.ashx",{
               doType:"getDetail",    
                OID_OIID:$routeParams.orderno
        },function(data){
            if(data.result){
               console.log(data)
               $scope.minemassage = data.msg;
            }else{
                layer.msg("获取信息失败");
            }
        })   
}])

//我的询价单详情
APP.controller("enquiryDetail",['$routeParams','$rootScope','$scope','$location','commonAjax','token',"$timeout",function($routeParams,$rootScope,$scope,$location,commonAjax,token,$timeout){
    $scope.zhuangtai = "全部状态"
    function enquiryDetailInit(){
        var hash = location.hash;
        /*取到ioiid*/
        var ioiid = hash.split("/")[2];
        commonAjax("/InterFace/InquireOrderInfoInterFace.ashx",{
            doType:"getDetail",
            IOID_IOIID:ioiid,
        },function(data){
            console.log(data,1);
            if(data.result){
                if(data.msg.Detail && data.msg.Detail.length > 0){
                    $scope.number = data.msg.IOI_Number;
                    //*询价状态判断*/
                    $scope.items = data.msg.Detail;
                }else{
                    // $scope.item2 = data.msg.Detail;
                }
                /*总询价状态判断*/
                if(data.msg.state == 0){
                    $scope.enquiryStateImgUrl =  "../images/enquiryDetail_step_one.png";
                } else if(data.msg.state == 1){
                    $scope.enquiryStateImgUrl =  "../images/enquiryDetail_step_two.png"
                } else if(data.msg.state == 2){
                    $scope.enquiryStateImgUrl =  "../images/enquiryDetail_step_three.png"
                } else {
                    $scope.enquiryStateImgUrl =  "../images/enquiryDetail_step_one.png";
                }
                // $scope.enquiryStateImgUrl();
            }
        })
    }
    // //查询点击
    // $scope.update=function(){
    //     orderListInit();
    // }
    /*初始化*/
    enquiryDetailInit()

}])



