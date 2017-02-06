APP.controller("enquiryCarCtrl",['$scope','$location','$timeout','commonAjax','token',
    function($scope,$location,$timeout,commonAjax,token){
        // 获取登录状态

        $scope.msg =token.get('login');
        if($scope.msg){
            $scope.CI_ID=$scope.msg.CI_ID;
        }
        // test
        // $scope.CI_ID="b0731973-8894-4d84-83b1-a059a46fddcb";

        $scope.check=[];
        $scope.allCheck=false;
        $scope.subCount=1;
        $scope.sex="man";

        // 获取登录用户询价篮数据
        $scope.getInfo = function(){
            if($scope.msg){
                // 已经登录
                commonAjax("/InterFace/InquireOrderBaseInterFace.ashx",{
                    doType:"GetList",
                    CI_ID:$scope.CI_ID,
                },function(data){
                    $scope.infoList=data.msg;
                    // console.log($scope.infoList)
                    for(var i=0;i<$scope.infoList.length;i++){
                      $scope.   infoList[i].Count = 1;
                    }
                    // 获取多少条数据
                    $scope.check=new Array($scope.infoList.length);
                    // $scope.check= new Array(data.msg.length);
                });
            }else{
                // 未登录 读取本地数据
                $scope.infoList=token.get("productmassage");
            }
        }
        $scope.p=[];
        // 登录用户移除询价篮中的商品
        $scope.deleteInfo =function(id,item,i){
            if($scope.msg){
                commonAjax("/InterFace/InquireOrderBaseInterFace.ashx",{
                doType:"deleteInquireItem",
                CI_ID:$scope.CI_ID,
                Commodity_ID:id,
            },function(data){
                // console.log(data,);
                //$scope.infoList.remove(item);
                layer.msg(data.msg);
                if(data.result==true){
                    // delatelist(e)
                    $scope.p[i]=true;
                }
                
            });
            }else{
                delete $scope.infoList[id];
                token.set('productmassage',$scope.infoList);
                $scope.p[i]=true;
            }
            
        }

        // 更新询价篮商品数量
        $scope.updateInfo = function(index,id,count,status){
            if(status==-1){
                count = parseInt(count)-1;
                if(count<1){count=1}
            }else{
                count = parseInt(count)+1;
            }
            if($scope.msg){
            commonAjax("/InterFace/InquireOrderBaseInterFace.ashx",{
                doType:"updateCount",
                CI_ID:$scope.CI_ID,
                Commodity_ID:id,
                Count:count
            },function(data){
                // console.log(data,);
                layer.msg(data.msg);
                if(data.result==true){
                    // 更新画面数量
                    $scope.infoList[index].Count=count;
                }
            });

        }else{
            $scope.infoList[id].Count=count;
            token.set('productmassage',$scope.infoList)
        }
        }

        // 提交询价单
        $scope.submit =function (){
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
        if($scope.msg.CI_Email){
            if(!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($scope.msg.CI_Email)){
               layer.msg("请正确的邮箱");
                return 
            }
        }

            // obj.IOI_ClienteleName=$scope.IOI_ClienteleName;
            var obj={};

            obj.IOI_ClienteleName =$scope.msg.CI_Name || "";
            obj.IOI_Contacter =$scope.msg.CI_CompanyName || "";
            obj.IOI_PhoneNo =$scope.msg.CI_MobilePhoneNo || "";
            obj.IOI_PhoneNumber =$scope.telNum || "";
            obj.IOI_Email =$scope.msg.CI_Email || "";
            // to do
            // obj.IOI_FileUrl =$scope.FileUrl || "";
            obj.IOI_FileExplain =$scope.orderTips || "";

            // 获取选中的订单详情
            obj.InquireOrderDetail =[];
            for(var i=0;i<$scope.check.length;i++){
                if($scope.check[i]==true){
                    var temp ={};
                    temp.IOID_CIID=$scope.infoList[i].CI_ID;
                    temp.IOID_Count=$scope.infoList[i].Count;
                    obj.InquireOrderDetail.push(JSON.stringify(temp));

                }
            }
            if(obj.InquireOrderDetail.length==0){
                layer.msg("你还没有添加任何询价的商品");
                return;
            }
            commonAjax("/InterFace/InquireOrderInterFace.ashx",{
                doType:"submit",
                CI_ID:$scope.CI_ID,
                IOI_ClienteleName:obj.IOI_ClienteleName,
                IOI_Contacter:obj.IOI_Contacter,
                IOI_PhoneNo:obj.IOI_PhoneNo,
                IOI_PhoneNumber:obj.IOI_PhoneNumber,
                IOI_Email:obj.IOI_Email,
                IOI_FileUrl:obj.IOI_FileUrl,
                IOI_FileExplain:obj.IOI_FileExplain,
                InquireOrderDetail:"["+obj.InquireOrderDetail+"]",
            },function(data){
                layer.msg(data.msg);
                if(data.result){
                    $timeout(reload, 2000);
                }
            });
        }
        var reload = function(){
            window.location.reload();
        }
        $scope.checkAll=function(flag){
            $timeout(function(){
            if(flag==false){
                for(var i=0;i<$scope.check.length;i++){
                    $scope.check[i]=true;
                }
            }else{
                for(var i=0;i<$scope.check.length;i++){
                    $scope.check[i]=false;
                }
            };
            $scope.count();
        })
    }
        $scope.count=function(){
            $scope.subCount=0;
            for(var i=0;i<$scope.check.length;i++){
                if($scope.check[i]==true){
                    $scope.check[i];
                    $scope.subCount++;
                }
            }
        }

        // 初始化页面
        $scope.getInfo();
        $scope.count();
    }]);