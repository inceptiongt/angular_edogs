/**
 * Created by Administrator on 2017/1/27 0027.
 */
APP.controller("CommondityList",['$scope','$location','commonAjax','pageFn',
    function($scope,$location,commonAjax,pageFn){
        function getUrlArgStr(){
        var q=location.search.substr(1);
        q = (decodeURIComponent(q));
        var qs=q.split('&');
        var args=new Object();
        var argStr='';
        if(qs){
            for(var i=0;i<qs.length;i++){
                argStr+=qs[i].substring(0,qs[i].indexOf('='))+'='+qs[i].substring(qs[i].indexOf('=')+1)+'&';
            }
        }
        var pairs=argStr.split("&");//在&处断开
        for(var i=0;i<pairs.length;i++){
            var pos=pairs[i].indexOf('=');//查找name=value
            if(pos==-1){//如果没有找到就跳过
                continue;
            }
            var argname=pairs[i].substring(0,pos);//提取name
            var value=pairs[i].substring(pos+1);//提取value
            args[argname]=unescape(value);//存为属性
        }

        return args;//返回对象
    }
    var urlobj = getUrlArgStr();





        // 获得搜索词
        // var items= location.search.split("=");
        // SearchWord=decodeURIComponent(items[1]);
        // $scope.SearchWord=decodeURIComponent(items[1]);

        // if($scope.SearchWord!="undefined"){
        //     $("#searchWd").val($scope.SearchWord);
        // }
        $scope.current=1;
        $scope.getInfo=function(obj){
            // var sWd,fId,sId,pageNum;
            $scope.sWd= obj.SearchWord || "";
            $scope.fId=obj.fId || "";
            $scope.sId=obj.sId || "";
            $scope.pageNum =obj.pageNum||1;
            // 请求数据
            commonAjax("/InterFace/CommodityInterFace.ashx",{
                doType:"getList",
                PageIndex:$scope.pageNum,
                CI_FirstType:$scope.fId,
                CI_SecondType:$scope.sId,
                SearchWord:urlobj.SearchWord,
            },function(data){
                // console.log(data,);
                console.log($scope.current)

                if(!data.msg.RtnList ||($scope.current==1 && data.msg.RtnList.length==0) ){
                layer.confirm('您当前未搜索到您需要查询的商品，是否要自定义询价单？', {
                  btn: ['确定','取消'] //按钮
                    }, function(){
                        window.location.href="enquiryCar.html"
                    }, function(){
                       layer.close();
                    });
                }
                $scope.infoList=data.msg.RtnList;
                $scope.count=data.msg.AllCount;
                $scope.pageSize=data.msg.PageSize;
                witchcurrent();
                currentclick();
                if(urlobj.SearchWord){
                    $("#searchWd").val(urlobj.SearchWord);
                }
                
            });
        }
    $scope.getList=function(){
        // 请求数据
        commonAjax("/InterFace/MainPageInterFace.ashx",{
            doType:"GetMainData",
    },function(data){
            // console.log(data,);
            $scope.items=data.msg.AllTypeList ;
            
            var temp=$scope.items[urlobj.yiji]||$scope.items[0];
            
            if ($scope.items[urlobj.yiji]) {
                $scope.erji = $scope.items[urlobj.yiji].Level1Name;
            }
            
            if($scope.SearchWord!="undefined"){
                $scope.getInfo({SearchWord:$scope.SearchWord});
            }else {
                $scope.getInfo({fId: temp.Level1ID, sId: temp.CommodityTypeLevel2[0].CT_ID});
            }
        });
    };
    var witchcurrent = function (){
       $('#fenlei .childItem:eq('+urlobj.yiji+')').addClass('current').find(".listdetail").slideDown();
       $('#fenlei .childItem:eq('+urlobj.yiji+')').find('img').attr("src",'./images/down.png')

    }
    var currentclick = function(){
        $('#fenlei .childItem').click(function(){
            $(this).addClass('current').find(".listdetail").slideDown();
            $(this).find('img').attr("src",'./images/down.png');
            $(this).siblings().removeClass('current').find('img').attr("src",'./images/up.png');
            $(this).siblings().find(".listdetail").slideUp();
            $("#current").html($(this).find('span').html());
        })
    }
    $scope.sort=function(e,order){
        $(".sales,.new").css({background:""});
        e.target.status=e.target.status || 1;
        if(e.target.status===1){
            e.target.status = -1;
            $scope.order="-"+order;
            e.target.style.backgroundImage="url(./images/sortDown.png)";
        }else{
            $scope.order=order;
            e.target.status = 1;
            e.target.style.backgroundImage="url(./images/sortUP.png)";
        }
        e.target.style.backgroundPosition="70% 30%";
        e.target.style.backgroundRepeat="no-repeat";
    }


        //分页
        $scope.all_page =($scope.pageSize != undefined )?$scope.pageSize:1;

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
            $scope.current=page;
            $scope.load_page(page);
        };
        // function pageK(current){
        //     $scope.pages.forEach(function(tt){
        //         $scope["p"+tt]=false;
        //     })
        //     $scope["p"+current]=true;
        // }
        //分页
        var reloadPno = function(current){
            $scope.pages=pageFn.calculateIndexes(current,$scope.all_page,5);
        };
        reloadPno(1);

        $scope.load_page = function (current) {

            $scope.all_page =($scope.pageSize !=undefined)?$scope.pageSize:1;
            if(current<1 || current > $scope.all_page){
                return;
            }
            $scope.pages.forEach(function(tt){
                // console.log(tt)
                $scope["p"+tt]=false;
            })
            $scope["p"+current]=true;
            $scope.currentP = current;
            reloadPno(current);
            // 获取数据
            //getdata($scope.dadyS,$scope.dadyT,chooseStr,current)
            $scope.getInfo({pageNum:$scope.current,fId:$scope.fId,sId:$scope.sId,SearchWord:$scope.SearchWord});

        };

    $scope.load_page(1);

    $scope.getList();
    }]);

