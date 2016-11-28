
var USER = $api.getStorage( 'loginInfo' );

//常量
//用户类型
//提单方
var CONST_MAKER_PARTNER = 8,	// 个人
	CONST_MAKER_ENTERPRISE = 9,	//企业
	CONST_MAKER_PERSON_TO_COMPANY = 10,	// 个人转企业
	CONST_MAKER_DISTI_FAE = 3,	//	待定
	CONST_SI = 11,	// dashboard
	CONST_DISTI_FAE = 13;	//	FAE
    
if( USER ){
    if( USER.roleId === CONST_MAKER_PERSON_TO_COMPANY ){
        USER.roleId = CONST_MAKER_ENTERPRISE;
    }    
}
//项目创建用户类型
var CREATE_USER_PARTNER = 0,
	CREATE_USER_ENTERPRISE = 1;


var LIMIT = 6,	//	条数
	SKIP = 0;	//	跳过条数




//网络请求的方法
//是否是调试阶段
var debug = false;
//提取相同访问路径
var host = '', appId, key;
if (debug) {
    appId = 'A6915575028231';
    key = 'C7C54F3F-2687-A129-C25B-E7421467AEF0';
    host = 'http://mytest.bjcric.com.cn/intelcceapp/';
} else {
    appId = 'A6902958877271';
    key = '9F406FEA-D666-6CC9-BBDE-F6A5771CAE8A';
    host = 'https://ccechina.intel.com/';
}


function fnAjax( obj, cb ){
    typeof obj.progress === 'undefined' && api.showProgress({
        title: fnLanguageSwitch( '加载中...' ),
        text: fnLanguageSwitch( '请稍后...' ),
        modal: true
    });

    api.addEventListener({
        name: obj.url
    }, function(ret, err) {
        fnAjax( obj, cb );
    });

    var _files = obj.data && obj.data.files,
        _headers = {
            authorization: USER && USER.token
        };
    if( ! _files ){
        _headers[ 'Content-type' ] = 'application/json';
    }
    var vParam = {
//              url: 'http://192.168.3.14:3005/api/'+obj.url,   // 
//              url: 'http://52.199.36.249/api/'+obj.url,   // 
//              url: 'http://52.197.80.199/api/'+obj.url,   // 
//              url: 'http://42.159.142.69/api/'+obj.url,   //
    			url: 'http://192.168.3.6:3005/api/'+obj.url, //项目列表
//              url: 'http://192.168.3.7:3005/api/'+obj.url, //项目列表
        method: obj.method || ( obj.data ? 'post' : 'get' ),
        cache: false,
        headers: _headers,
        timeout: obj.timeout || 10,
        tag: obj.url,
        data: {
            body: JSON.stringify( obj.data && obj.data.values ),
            files: _files
        }
    };
    if( obj.debug )debugAlert( vParam );
    var signature = api.require('signature');
    signature.sha1({
        data: JSON.stringify( vParam )
    }, function(ret, err) {
        if (ret.status) {
            var _sign = ret;
            api.ajax(vParam, function (ret, err) {
                api.hideProgress(); 
                if( ret || err.body && err.body.error){
                    api.writeFile({
                        path: 'cache://ajaxData/'+_sign.value,
                        data: arguments
                    });
                    cb( ret, err );
                }else{
                    // if( api.connectionType === 'none' ){

                    // }else{

                    // }
                    if( fnIsEmp( obj.cache ) ){
                        _fnAlert(ret, err); 
                    }else{
                        api.readFile({
                            path: 'cache://ajaxData/'+_sign.value
                        }, function(ret2, err2) {
                            if( ret2.data ){
                                ret2.data = JSON.parse( ret2.data );
                                api.toast({
                                    msg: fnLanguageSwitch( '当前处于离线环境，请检查网络！' )
                                });
                                cb( ret2.data[0], ret2.data[1] );
                            }else{
                                _fnAlert( ret, err);
                            }
                            api.refreshHeaderLoadDone();
                        });   
                    }
                }
            });
        }
    });

    function _fnAlert(){
    	if( obj.debug )debugAlert( arguments );
        var _nets = $api.getStorage('OffTheNet') || [];
        if( _nets.indexOf( obj.url ) === -1 ){
            _nets.push( obj.url );    
        }
        $api.setStorage('OffTheNet', _nets);
        setTimeout(function(){
            if( ! $api.getStorage('network') ){
                $api.setStorage('network', {});
                api.confirm({
                    title: fnLanguageSwitch( '网络出现了错误，请检查以后"确定"重载页面' ),
                    msg: fnLanguageSwitch( '已经检查网络，确认重载页面？' ),
                    buttons: [ fnLanguageSwitch( '确定' ), fnLanguageSwitch( '取消' ) ]
                }, function(ret, err) {
                    if( ret.buttonIndex === 1 ){
                        // location.reload();
                        for( var x in _nets ){
                            api.sendEvent({
                                name: obj.url,
                                extra: {
                                    ev: true
                                }
                            });   
                        }
                        $api.rmStorage('OffTheNet');
                    }
                    $api.rmStorage('network');
                }); 
            }
        }, 300);
    }
}

function fnStringEmpty( string ){
	return typeof string === 'undefined' || string === null ? '--' : string;
}

function fnNumberEmpty( num ){
	return num < 10 ? '0' + num : num;
}


function fnFilter(data, id){
	for( var x in data ){
		if( data[x].id === id ){
			return data[x];
		}
	}
}

function getImageCache(el){
	var url = $api.attr(el, 'data-selectorid');
	if( url !== 'undefined' ){
		api.imageCache({
	        url: url,
	        policy: 'cache_else_network',
	        thumbnail: true
	    }, function(ret, err){
	        if ( ret && ret.status) {
	        	if( el.tagName === 'IMG' ){
	            	$api.attr(el, 'src', ret.url);
	        	}else{
	        		$api.css(el,'background-image: url('+ret.url+')');
	        	}
	        }
	    });	
	}
};


function fnUpgrade(){
    fnAjax({
        url: 'users/ifApplyRoleTurn'
    }, function( ret, err ){
    	if( ret ){
    		if( ret.success === true ){
	            api.toast({
					global: true,
	                msg: fnLanguageSwitch( '您已经申请升级成企业用户，请不要重复操作，谢谢!' )
	            });
    		}else if(  ret.success === false ){
	            fnOpen({
	                name: 'upgrade_win',
	                url: 'widget://' + DIR + '/member_center/upgrade.html',
	                pageParam: {
	                	
	                }
	            });
    		}
        }else{
            api.toast({
				global: true,
                msg: fnLanguageSwitch( fnErrorJson( err.body.error.message ) )
            });
        }
    });
}

//fnLanguageSwitch( '登录' )
function fnErrorJson( value ){
    var vLanguageJSON = {
        'user_does_not_exist': '用户名不存在',
        'password_error': '密码错误',
        'user_is_administrator': '用户账号为后台管理角色，暂不能登录APP',
        'get_error': '获取信息失败',
        len: 1
    }
    if( value in vLanguageJSON ){
        return vLanguageJSON[ value ];
    }else{
        return value;
    }
}

// 验证
function fnVerify( type ) {
    if( type === 'Email' ){
        return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    }else if( type === 'Phone' ){
        return /^1\d{10}$/;
    }else if( type === 'Tel' ){
        return /^0\d{2,3}-?\d{7,8}$/;
    }
};
    
    
function fnOpen( obj ){
	var vParam = {
        name: obj.name,
        url: obj.url,
        pageParam: obj.pageParam,
        slidBackEnabled: false,
        delay: api.systemType === 'ios' ? 0 : 300,
        animation: obj.animation || null
//      animation: isHuawei() ? {
//          type: 'movein',
//          subType: 'from_right'
//      } : ''
    };
    if( obj.debug )debugAlert( vParam );
    api.openWin( vParam );
}

function debugAlert(){
    if( true ){
        var vTemp = []; 
        for( var x in arguments ){
            vTemp.push( arguments[x] );
        }
        vTemp = JSON.stringify( vTemp );
        alert( vTemp.substring( 1, vTemp.length-1) );
    }
}



//url :接口访问路径
//method:接口访问方法 “get”、“post”
//bodyParam:body请求体参数
//callBack 接口访问的回调
var isAjaxCancel = false;

var tipsFn = (function(){

    var tipsConfig = {
        en : {
            network : 'Please check your network connection.',
            loginAgin : {
                title : 'Notice',
                msg : 'Your account is logged on to another device, please log in again.',
                buttons: ['OK']
            }

        },
        zh : {
            network : '请检查网络连接',
            loginAgin : {
                title: '提示',
                msg: '你的账号在其他设备登录,请重新登录',
                buttons: ['确定']
            }
        }
    }   
    return function(){
        if( DIR == "html" ) {
            return tipsConfig.zh;
        }else{
            return tipsConfig.en;
        }
    }
})();


//当前语言环境
var DIR = 'en';
// if ( $api.getStorage('app_language')) {
//     DIR = $api.getStorage('app_language');
// }else{
//     $api.setStorage('app_language','html');
// }

var tipObj = tipsFn();


function ajaxRequest(url, method, values, files, callBack) {
    if (api.connectionType == 'none') {
        api.hideProgress();
        api.toast({
	global: true,
            msg: tipObj.network,
            duration: 2000,
            location: 'middle'
        });
        return;
    }
    if (method.toLowerCase() == 'get') {
        url += convertParam(values);
        values = {};
    } else {
    }

    var data = {
        values: values
    };

    if (typeof(files) == 'function') {
        callBack = files;
    } else {
        data.files = files;
    }
    api.ajax({
        url: host + url,
        method: method,
        cache: true,
        timeout: 30,
        data: data
    }, function (ret, err) {
        if (ret && ret.res == 0 && (ret.des == '请重新登录' || ret.des == 'please Relogin')) {
            if (!isAjaxCancel) {
                isAjaxCancel = true;
                api.alert(tipObj.loginAgin, function (ret, err) {
                    $api.rmStorage('autoLogin');
                    $api.rmStorage('loginInfo');
                    $api.rmStorage('password');
                    api.sendEvent({
                        name: 'language_changed_login'
                    });
                });

            }
            return;
        }
        callBack && callBack(ret, err);
    });
}

function Models(){

    var now = Date.now(),

        appKey = SHA1(appId + "UZ" + key + "UZ" + now) + "." + now;

    var baseUrl = 'https://d.apicloud.com/mcm/api/';

    var executeRequest = function(url, successFn, errorFn){

        var ajaxConfigs =  {
            url: baseUrl + url,
            method: 'get',
            timeout: 300,
            dataType: 'json',
            headers: {
                "Content-type": "application/json;charset=UTF-8",
                "X-APICloud-AppId": appId,
                "X-APICloud-AppKey": appKey
            }
        };        
        // console.log( JSON.stringify( ajaxConfigs ) )
        api.ajax( ajaxConfigs, function(ret, err){

            if( ret ){
                successFn && successFn( ret[0] );
            }else{
                errorFn && errorFn( err );
            }
            
        })
    }

    return {
        getVedioUrl : function(successFn, errorFn){
            executeRequest('videoUrl?filter={"where":{},"skip":0,"limit":20}', successFn, errorFn)
        }
    }
}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
function convertParam(param) {
    var _param = '', symbol = '?';
    for (var key in param) {
        if (typeof param[key] == 'function') {
            continue;
        }
        _param += ('&' + key + '=' + param[key]);
    }
    return symbol + _param
};



function fnIsEmp( val ){
	return typeof val !== 'undefined';
}


//市场应用类型
function fnApplicationMarketJson(){
    var _type = {};
    _type[ CONST_MAKER_PARTNER ] = {
	    '8a5a638d-117c-4031-a9f1-865c6092f890': fnLanguageSwitch( '可穿戴设备' ),
	    '6a3294ee-5da8-4dc7-a228-7f77c3af451a': fnLanguageSwitch( '车载/车联网' ),
	    'f03949a5-87d3-485f-9275-70c8a7aff30e': fnLanguageSwitch( '智能家居设备' ),
	    '58cad4e9-b88a-4f86-a2e7-85d56b00b348': fnLanguageSwitch( '机器人' ),
	    '25c9d189-ff50-418e-a764-38b26217b7b9': fnLanguageSwitch( '其它' )
    };


    _type[ CONST_MAKER_ENTERPRISE ] = {
	    '2e93ca08-6b41-4581-9282-be896c11e381': fnLanguageSwitch( '刀片' ),	
	    '2e93ca09-6b41-4581-9282-be896c11e381': fnLanguageSwitch( '单板' ),	
	    '3ab49c86-b2cb-41cb-a7e7-6fb188a4a353': fnLanguageSwitch( '通讯基础设备' ),	
	    'ccaad54f-2466-4caf-9191-f1a0f6f3309a': fnLanguageSwitch( '数字安全监控' ),	
	    '5a4896d8-cf5c-4ef3-8c0f-e9d14d05d98f': fnLanguageSwitch( '新能源' ),	
	    '57c1270d-5a27-4ee0-a905-c5a7b462d36f': fnLanguageSwitch( '电子白板' ),	
	    '984a17c7-0df8-4d12-a1e6-042723fe42ea': fnLanguageSwitch( '游戏机' ),	
	    '83edcce7-9749-4793-9bf3-23af718e3ea3': fnLanguageSwitch( '健身设备' ),	
	    '7874e05a-f509-47ee-aeba-758368724ab7': fnLanguageSwitch( '车载多媒体设备' ),	
	    'f34177fc-8a56-4906-8251-4a81e5923591': fnLanguageSwitch( '工业自动化' ),	
	    '8ccf31f9-684c-4495-8ab4-b62b447dbe3f': fnLanguageSwitch( '工业人机界面' ),	
	    'a60c4bcc-e555-4a93-8cf0-27d85350c2a8': fnLanguageSwitch( '工业设备（其他）' ),	
	    'f520c663-1704-4b16-828d-7ce5de50609a': fnLanguageSwitch( '工业PC' ),	
	    '449a1c9f-b24e-4c59-88ab-b1b0151b6887': fnLanguageSwitch( '网络会议' ),	
	    '6db01f29-efd3-4544-bedb-19f61c73a084': fnLanguageSwitch( '物联网' ),	
	    'aec8428b-e91c-44ad-b99c-05d628b842b5': fnLanguageSwitch( '医疗' ),	
	    '67bcb8cc-9de1-4cdf-b7e0-526a2038e853': fnLanguageSwitch( '打印成像' ),	
	    '86eafd26-882f-4dc2-95bc-8ecab361eb92': fnLanguageSwitch( 'ATM' ),	
	    '9c11a248-4654-4491-a2b3-02ab52fa5246': fnLanguageSwitch( '数字标牌' ),	
	    'cdf4009a-2741-4443-bc12-10b5d266a0ab': fnLanguageSwitch( '自动贩卖机' ),	
	    'd2f65485-90a8-42f8-b74f-2ba1d423d45c': fnLanguageSwitch( '信息亭' ),	
	    '57e9c842-5e41-4313-81e1-b6653f065d5a': fnLanguageSwitch( 'POS' ),	
	    'c6b3bdb0-ad90-4c40-885a-206ae6f733cc': fnLanguageSwitch( '瘦客户机' ),	
	    '763b073f-08a2-4b5f-a9f6-32942acfee94': fnLanguageSwitch( '存储系统' ),	
	    'd6026612-ad1b-45ad-acbf-7d514ca91fcf': fnLanguageSwitch( '智能交通' ),	
	    'c3840011-128f-4a62-8599-1b17fb50bb68': fnLanguageSwitch( '平板' ),	
	    'b9a12807-41df-4604-b596-2899393aaf25': fnLanguageSwitch( '网络安全' ),	
	    'a11e25f2-17ac-4637-ac39-73e98bcf833f': fnLanguageSwitch( '其它' ),	
	    '721eca84-0540-4b70-a93c-48178619eeb0': fnLanguageSwitch( '机器人' ),	
	    'f6b6b764-4d81-4a8f-bb0b-57fc29828462': fnLanguageSwitch( '无人机' ),	
	    '4adc7039-e16d-4e2b-a123-403e3f8805b8': fnLanguageSwitch( '可穿戴' ),	
	    'c0660d34-e007-4a35-9bb9-2b7c7f575f4f': fnLanguageSwitch( 'AR' ),	
	    'b6a5e9bd-2079-454a-a9e5-95f17a2ea686': fnLanguageSwitch( 'VR' )
    };
    return _type[ USER.roleId ];
}



// 新增项目
function createNewProject() {
    fnAjax({
        url: 'users/ifApplyRoleTurn',
        chache: false
    }, function( ret, err ){
        if( ret ){
            if( ret.success === true ){
                api.toast({
                   global: true,
                    msg: fnLanguageSwitch( '您当前处于个人转企业审核阶段，暂不能新增项目。审核通过后，即可已企业用户的身份新增项目。' )
                });
            }else if(  ret.success === false ){
                fnAjax({
                    url: 'users/ifUserInfoPerfect',
                    chache: false
                }, function( ret, err ){
                    if( ret ){
                        if( ret.success === true ){
                            fnOpen({
                                name: 'create_new_project',
                                url: 'widget://' + DIR + '/simple_page/create_new_project_win.html',
                                pageParam: {
                                    data: {
                                        name: fnLanguageSwitch( '新建项目' )
                                    }
                                }
                            });
                        }else if(  ret.success === false ){
                            api.alert({
                                title: fnLanguageSwitch( '提醒' ),
                                msg: fnLanguageSwitch( '您的个人信息尚未完善，请先完善信息' )
                            }, function () {
                                fnOpen({
                                    name: 'profile',
                                    url: 'widget://' + DIR + '/member_center/profile.html'
                                });
                            });
                        }
                    }else{
                        api.toast({
                            msg: fnLanguageSwitch( fnErrorJson( err.body.error.message ) )
                        });
                    }
                });
            }
        }else{
            api.toast({
                msg: fnLanguageSwitch( fnErrorJson( err.body.error.message ) )
            });
        }
    });
}
//市场应用类型
function fnApplicationJson(){
    return {
	    '8a5a638d-117c-4031-a9f1-865c6092f890': fnLanguageSwitch( '可穿戴设备' ),
	    '6a3294ee-5da8-4dc7-a228-7f77c3af451a': fnLanguageSwitch( '车载/车联网' ),
	    'f03949a5-87d3-485f-9275-70c8a7aff30e': fnLanguageSwitch( '智能家居设备' ),
	    '58cad4e9-b88a-4f86-a2e7-85d56b00b348': fnLanguageSwitch( '机器人' ),
	    '25c9d189-ff50-418e-a764-38b26217b7b9': fnLanguageSwitch( '其它' ),
	    '2e93ca08-6b41-4581-9282-be896c11e381': fnLanguageSwitch( '刀片' ),	
	    '2e93ca09-6b41-4581-9282-be896c11e381': fnLanguageSwitch( '单板' ),	
	    '3ab49c86-b2cb-41cb-a7e7-6fb188a4a353': fnLanguageSwitch( '通讯基础设备' ),	
	    'ccaad54f-2466-4caf-9191-f1a0f6f3309a': fnLanguageSwitch( '数字安全监控' ),	
	    '5a4896d8-cf5c-4ef3-8c0f-e9d14d05d98f': fnLanguageSwitch( '新能源' ),	
	    '57c1270d-5a27-4ee0-a905-c5a7b462d36f': fnLanguageSwitch( '电子白板' ),	
	    '984a17c7-0df8-4d12-a1e6-042723fe42ea': fnLanguageSwitch( '游戏机' ),	
	    '83edcce7-9749-4793-9bf3-23af718e3ea3': fnLanguageSwitch( '健身设备' ),	
	    '7874e05a-f509-47ee-aeba-758368724ab7': fnLanguageSwitch( '车载多媒体设备' ),	
	    'f34177fc-8a56-4906-8251-4a81e5923591': fnLanguageSwitch( '工业自动化' ),	
	    '8ccf31f9-684c-4495-8ab4-b62b447dbe3f': fnLanguageSwitch( '工业人机界面' ),	
	    'a60c4bcc-e555-4a93-8cf0-27d85350c2a8': fnLanguageSwitch( '工业设备（其他）' ),	
	    'f520c663-1704-4b16-828d-7ce5de50609a': fnLanguageSwitch( '工业PC' ),	
	    '449a1c9f-b24e-4c59-88ab-b1b0151b6887': fnLanguageSwitch( '网络会议' ),	
	    '6db01f29-efd3-4544-bedb-19f61c73a084': fnLanguageSwitch( '物联网' ),	
	    'aec8428b-e91c-44ad-b99c-05d628b842b5': fnLanguageSwitch( '医疗' ),	
	    '67bcb8cc-9de1-4cdf-b7e0-526a2038e853': fnLanguageSwitch( '打印成像' ),	
	    '86eafd26-882f-4dc2-95bc-8ecab361eb92': fnLanguageSwitch( 'ATM' ),	
	    '9c11a248-4654-4491-a2b3-02ab52fa5246': fnLanguageSwitch( '数字标牌' ),	
	    'cdf4009a-2741-4443-bc12-10b5d266a0ab': fnLanguageSwitch( '自动贩卖机' ),	
	    'd2f65485-90a8-42f8-b74f-2ba1d423d45c': fnLanguageSwitch( '信息亭' ),	
	    '57e9c842-5e41-4313-81e1-b6653f065d5a': fnLanguageSwitch( 'POS' ),	
	    'c6b3bdb0-ad90-4c40-885a-206ae6f733cc': fnLanguageSwitch( '瘦客户机' ),	
	    '763b073f-08a2-4b5f-a9f6-32942acfee94': fnLanguageSwitch( '存储系统' ),	
	    'd6026612-ad1b-45ad-acbf-7d514ca91fcf': fnLanguageSwitch( '智能交通' ),	
	    'c3840011-128f-4a62-8599-1b17fb50bb68': fnLanguageSwitch( '平板' ),	
	    'b9a12807-41df-4604-b596-2899393aaf25': fnLanguageSwitch( '网络安全' ),	
	    'a11e25f2-17ac-4637-ac39-73e98bcf833f': fnLanguageSwitch( '其它' ),	
	    '721eca84-0540-4b70-a93c-48178619eeb0': fnLanguageSwitch( '机器人' ),	
	    'f6b6b764-4d81-4a8f-bb0b-57fc29828462': fnLanguageSwitch( '无人机' ),	
	    '4adc7039-e16d-4e2b-a123-403e3f8805b8': fnLanguageSwitch( '可穿戴' ),	
	    'c0660d34-e007-4a35-9bb9-2b7c7f575f4f': fnLanguageSwitch( 'AR' ),	
	    'b6a5e9bd-2079-454a-a9e5-95f17a2ea686': fnLanguageSwitch( 'VR' )
    };
}


//	可获取支持服务
function fnSupportServicesJson(){
    var _type = {};
    _type[ CONST_MAKER_PARTNER ] = {
	    'icon-chain': {
	    	type: [0,1,4],		//
	    	name: fnLanguageSwitch( '产业链对接' )
	    },
	    'icon-doc': {
	    	type: [1, 2, 3],
	    	name: fnLanguageSwitch( '技术文档申请' )
	    },
	    'icon-discus': {
	    	type: [1, 2, 3],
	    	name: fnLanguageSwitch( '咨询方案讨论' )
	    },
	    'icon-debug': {
	    	type: [2,3],
	    	name: fnLanguageSwitch( '项目Debug' )
	    },
	    'icon-promotion': {
	    	type: [3],
	    	name: fnLanguageSwitch( '方案推广' )
	    }
    };

    _type[ CONST_MAKER_ENTERPRISE ] = {
	    'icon-chain': {
	    	type: [0,1,4],
//	    	type: [0,1,2,3,4,5,6,7,8,9],
	    	name: fnLanguageSwitch( '产业链对接' )
	    },
	    'icon-doc': {
	    	type: [1, 2, 3, 4],
//	    	type: [0,1,2,3,4,5,6,7,8,9],
	    	name: fnLanguageSwitch( '技术文档申请' )
	    },
	    'icon-discus': {
	    	type: [1, 2, 3, 4],
//	    	type: [0,1,2,3,4,5,6,7,8,9],
	    	name: fnLanguageSwitch( '咨询方案讨论' )
	    },
	    'icon-crb': {
	    	type: [1, 2, 3, 4],
//	    	type: [0,1,2,3,4,5,6,7,8,9],
	    	name: fnLanguageSwitch( '开发板借测' )
	    },
	    'icon-edc': {
	    	type: [1, 2, 3, 4],
//	    	type: [0,1,2,3,4,5,6,7,8,9],
	    	name: fnLanguageSwitch( 'EDC特权帐号' )
	    },
	    'icon-schematic': {
	    	type: [2, 3, 4],
//	    	type: [0,1,2,3,4,5,6,7,8,9],
	    	name: fnLanguageSwitch( '原理图审阅' )
	    },
	    'icon-debug': {
	    	type: [2, 3, 4],
//	    	type: [0,1,2,3,4,5,6,7,8,9],
	    	name: fnLanguageSwitch( '项目Debug' )
	    },
	    'icon-sample': {
	    	type: [2, 3, 4],
//	    	type: [0,1,2,3,4,5,6,7,8,9],
	    	name: fnLanguageSwitch( '免费样片' )
	    },
	    'icon-promotion': {
	    	type: [3, 4],
//	    	type: [0,1,2,3,4,5,6,7,8,9],
	    	name: fnLanguageSwitch( '方案推广' )
	    },
	    'icon-pricing': {
	    	type: [3, 4],
//	    	type: [0,1,2,3,4,5,6,7,8,9],
	    	name: fnLanguageSwitch( '竞争性价格支持' )
	    }
    };
    return _type[ USER.roleId ];
}


//英特尔产品类型
function fnProductTypeJson( id ){
    var _type = {};
    _type[ CONST_MAKER_PARTNER ] = {
		'45034e74-5477-4490-b292-a6d052562c89': fnLanguageSwitch( '夸克' ),
		'82021272-23cd-434a-ad57-c4ee08df9460': fnLanguageSwitch( '伽利略' ),
		'f1f2a51c-6fce-4582-a9b1-c6e9a50f7d9f': fnLanguageSwitch( '爱迪生' ),
		'a681a76f-ba92-45e6-a354-d6337ddc57b2': fnLanguageSwitch( 'Genuino 101' ),
		'a681aa6e-ba92-45e6-a354-d6337ddc57b2': fnLanguageSwitch( '英特尔其他产品' )
    };

    _type[ CONST_MAKER_ENTERPRISE ] = {
		'c865f36d-3143-40bc-9564-ba93251ff6a6': fnLanguageSwitch( 'CPU(处理器)' ),
		'23842c76-df2f-4802-83dd-091c81f76e4d': fnLanguageSwitch( 'CHIPSET(芯片组)' ),
		'a9eac9e0-259a-483b-8e56-40234ac9c375': fnLanguageSwitch( 'Board or NUC(主板,迷你电脑)' ),
		'ebea1230-2315-4138-b5f1-cf6d4e7f2642': fnLanguageSwitch( 'LAN（网络芯片）' ),
		'6c360e9b-de11-42bb-a725-4d53c8992fc0': fnLanguageSwitch( 'SSD（固态硬盘）' )
    };
    if( id == 0 ){
    	return _type[ CONST_MAKER_PARTNER ];
    }else if( id == 1 ){
    	return _type[ CONST_MAKER_ENTERPRISE ];
    }else{
    	return _type[ USER.roleId ];
    }
}

//活动状态
function fnActivetyStatusJson(){
	return {
	    '0': fnLanguageSwitch( '审核中' ),
	    '1': fnLanguageSwitch( '报名成功' ),
	    '2': fnLanguageSwitch( '审核不通过' )
	};
};



//用户类型
function fnTypeJson(){
    if( USER.roleId === CONST_MAKER_PARTNER ){
    	return {
	        '026d524e-7f69-4875-ae20-379979e0e454': fnLanguageSwitch( '个人' ),
	        'd8f77b02-6ce8-4bb2-9aad-f93c64f3c4a8': fnLanguageSwitch( '初创公司' ),
	        '02476ee4-e0e0-43f0-8e57-df2f855bfe03': fnLanguageSwitch( '投资机构(VC)' ),
	        '71e79b1b-50d7-4ab0-b188-095eace63965': fnLanguageSwitch( '创客空间/加速器' ),
	        '99849aee-f02f-41c4-b42c-00a0081765d4': fnLanguageSwitch( '供应链厂商' ),
	        'f460e0f1-0005-4c81-9165-0c0538dbd512': fnLanguageSwitch( '其他' )
	    };
    }else{
    	return {
	        'f1e2f3ea-ab9e-465c-a13e-ed6f276148e7': fnLanguageSwitch( '芯片厂商(IC)' ),
	        'f2469f5b-2c1d-4f82-8f87-305df76c7f9a': fnLanguageSwitch( '方案设计公司(IDH)' ),
	        'e1c9c863-9f5c-424d-83aa-21236e32baaa': fnLanguageSwitch( '工业设计公司(ID)' ),
	        '90ecfdbb-d2bd-4b21-83f7-5b8b4dc03a12': fnLanguageSwitch( 'ODM/OEM厂商' ),
	        'df236ac0-c127-4929-b467-4cbff6fa1550': fnLanguageSwitch( '系统集成商(SI)' ),
	        '1fdc6ea4-87fa-4cfe-8d28-31d5946905d5': fnLanguageSwitch( '代工厂(EMS)' ),
	        '5dc9ec19-d617-4c3c-a512-494bdd6a2be3': fnLanguageSwitch( '模具厂' ),
	        'eaaf7299-af82-4f6d-ba22-6d1eb40bd34d': fnLanguageSwitch( '互联网软件与服务公司(Internet)' ),
	        '33d3d932-5ae8-416f-bffe-2c3babd49fbb': fnLanguageSwitch( '独立软件开发商(ISV)' ),
	        '33641ea7-a605-4a51-92ab-617fc88e4930': fnLanguageSwitch( '投资机构(VC)' ),
	        'e8f3ac83-c377-4978-ba85-804c1081b069': fnLanguageSwitch( '其他' )
	    };
    }
}


//获取职位
function fnJobJson(){
	return {
		'79a063ad-6433-4a1a-ad5d-c4cdef60721b': fnLanguageSwitch( '总经理' ),
		'5f52cfea-03ee-4cee-a3e5-1434f482ff8c': fnLanguageSwitch( '总监' ),
		'7484c1b5-c43d-494a-897c-6d568f7d298b': fnLanguageSwitch( '经理' ),
		'b97948c5-8fba-415e-85e7-71df6d7bf0e1': fnLanguageSwitch( '工程师' ),
		'65914947-bb13-429c-aef7-a02aac5d4687': fnLanguageSwitch( '助理' ),
		'f0d45c31-1643-46d5-951e-79088dd6e4b2': fnLanguageSwitch( '销售' ),
		'98a83b9b-feb0-4429-b5eb-0bd750f509f9': fnLanguageSwitch( '采购' )
	}
}


//单套设备中使用数量
function fnNumberOfDevicesUsedJson	( id ){
    var _type = {};
    _type[ CONST_MAKER_PARTNER ] = {
    	'1': '1',
    	'2': '2',
    	'3': '3',
    	'4': '4',
    	'5': '5',
    	'6': '6',
    	'7': '7',
    	'8': '8',
    	'9': '9'
    };

    _type[ CONST_MAKER_ENTERPRISE ] = {
    	'c865f36d-3143-40bc-9564-ba93251ff6a6': [1, 2],
    	'23842c76-df2f-4802-83dd-091c81f76e4d': [1],
    	'a9eac9e0-259a-483b-8e56-40234ac9c375': [1],
    	'ebea1230-2315-4138-b5f1-cf6d4e7f2642': [1,2,3,4,5,6,7,8],
    	'6c360e9b-de11-42bb-a725-4d53c8992fc0': [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
    };
    return id ? _type[ USER.roleId ][ id ] :　_type[ USER.roleId ];
}



// 主板类型
function fnMainBoardTypeJson(){
	return {
		'1': fnLanguageSwitch( '自研主板' ),
		'2': fnLanguageSwitch( '外购主板' )
	}
}

// 项目状态
function fnProjectApprovalStatusJson( id ){
    var _type = {};
    _type[ CONST_MAKER_PARTNER ] = {
		'1': fnLanguageSwitch( '项目预研' ),
		'2': fnLanguageSwitch( '项目研发' ),
		'3': fnLanguageSwitch( '原型完成' )
    };

    _type[ CONST_MAKER_ENTERPRISE ] = {
		'1': fnLanguageSwitch( '项目预研' ),
		'2': fnLanguageSwitch( '项目研发' ),
		'3': fnLanguageSwitch( '项目量产' ),
		'4': fnLanguageSwitch( '项目小批' )
    };
    if( id == 0 ){
    	return _type[ CONST_MAKER_PARTNER ];
    }else if( id == 1 ){
    	return _type[ CONST_MAKER_ENTERPRISE ];
    }else{
    	return _type[ USER.roleId ];
    }
}

// 接单类型
function fnSingleTypeJson(){
	return {
		'1': fnLanguageSwitch( '模具/手版打样/ID工业设计/结构设计' ),
		'2': fnLanguageSwitch( '基于 Intel 芯片的设计' ),
		'3': fnLanguageSwitch( '接口板的设计+生产' ),
		'4': fnLanguageSwitch( '整机生产和组装厂' )
	}
}

var SI_CheckStatusColorMap = {
    '2': '#31c27C',
    '3': '#00AEEF',
    '4': '#f05E4b',
    '5': '#F8a900',
    '6': '#606060',
    '7': '#606060'
};

// 需求对接状态
function fnDemandDockingStatusJson(){
	return {
		'0': fnLanguageSwitch( '审核中' ),
		'1': fnLanguageSwitch( '审核未通过' ),
		'2': fnLanguageSwitch( '已发布' ),
		'3': fnLanguageSwitch( '沟通中' ),
		'4': fnLanguageSwitch( '合作确认中' ),
		'5': fnLanguageSwitch( '对接成功' ),
		'6': fnLanguageSwitch( '失败' ),
		'7': fnLanguageSwitch( '关闭' )
	}
}

// 子需求对接状态
function fnSubDemandDockingStatusJson(){
	return {
		'0': fnLanguageSwitch( '新需求' ),
		'3': fnLanguageSwitch( '沟通中' ),
		'4': fnLanguageSwitch( '合作确认中' ),
		'5': fnLanguageSwitch( '对接成功' ),
		'6': fnLanguageSwitch( '失败' ),
		'7': fnLanguageSwitch( '关闭' )
	}
}
	
// 公司生产人数 | 公司销售人数 | 公司规模	
function fnCompanySizeJson(){
	return {
		'9eaa1030-1887-4e76-a25d-daa5b4646d18': fnLanguageSwitch( '0-50人' ),
		'72cf2d2f-66d9-4d44-bf63-ae7dd08e6e78': fnLanguageSwitch( '50-100人' ),
		'2846ad11-7be5-41f2-88e1-962fb280318b': fnLanguageSwitch( '100-500人' ),
		'f813fa19-1777-4d40-b739-3597bdf4c13f': fnLanguageSwitch( '500人以上' )
	}
}



// 公司研发人数	
function fnCompanyRDJson(){
	return {
		'5dcb036d-12f0-47f0-8120-0c8bdf12ba2c': fnLanguageSwitch( '0-10人' ),
		'76ba4998-5a13-4335-891d-4ec5b695437c': fnLanguageSwitch( '10-20人' ),
		'48a148c3-f10b-4c4c-b8af-2bea6cdf9a47': fnLanguageSwitch( '20-50人' ),
		'e02c8468-8ca2-4d55-9699-1b7a9e4201b8': fnLanguageSwitch( '50人以上' ),
		'b8a2426a-f733-44e8-b9e3-c94d91cd6976': fnLanguageSwitch( '50人以下' )
	}
}



// 公司年营业额
function fnTurnoverJson(){
	return {
		'd36696bc-7e88-4ec5-951b-8512ace2016c': fnLanguageSwitch( '200万以下' ),
		'e954261f-6c2c-4a80-8076-65e5be0e6556': fnLanguageSwitch( '200万-500万' ),
		'c1ef1553-47cc-4898-9283-d2dab12a70a5': fnLanguageSwitch( '500万-1000万' ),
		'f3e3fead-35c7-450e-8ce4-9c614e0d862a': fnLanguageSwitch( '1000万-5000万' ),
		'8c72b123-2e9d-416f-9886-818294ce4a8e': fnLanguageSwitch( '5000万以上' )
	}
}

// 项目审批状态
function fnProjectStatusJson(){
	return {
		'0': fnLanguageSwitch( '审核中' ),
		'1': fnLanguageSwitch( '已通过' ),
		'2': fnLanguageSwitch( '未通过' ),
		'3': fnLanguageSwitch( '申请关闭' ),
		'4': fnLanguageSwitch( '已锁定' ),
		'5': fnLanguageSwitch( '已取消' ),
		'9': fnLanguageSwitch( '关闭' )
	}
}



// 接单能力
function fnConnectionAbilityJson(){
	return {
		'd36696bc-7e88-4ec5-951b-8512ace2016c': fnLanguageSwitch( '200万以下' ),
		'e954261f-6c2c-4a80-8076-65e5be0e6556': fnLanguageSwitch( '200万-500万' ),
		'c1ef1553-47cc-4898-9283-d2dab12a70a5': fnLanguageSwitch( '500万-1000万' ),
		'f3e3fead-35c7-450e-8ce4-9c614e0d862a': fnLanguageSwitch( '1000万-5000万' ),
		'8c72b123-2e9d-416f-9886-818294ce4a8e': fnLanguageSwitch( '5000万以上' ),		
		'5dcb036d-12f0-47f0-8120-0c8bdf12ba2c': fnLanguageSwitch( '0-10人' ),
		'76ba4998-5a13-4335-891d-4ec5b695437c': fnLanguageSwitch( '10-20人' ),
		'48a148c3-f10b-4c4c-b8af-2bea6cdf9a47': fnLanguageSwitch( '20-50人' ),
		'e02c8468-8ca2-4d55-9699-1b7a9e4201b8': fnLanguageSwitch( '50人以上' ),
		'b8a2426a-f733-44e8-b9e3-c94d91cd6976': fnLanguageSwitch( '50人以下' ),		
		'9eaa1030-1887-4e76-a25d-daa5b4646d18': fnLanguageSwitch( '0-50人' ),
		'72cf2d2f-66d9-4d44-bf63-ae7dd08e6e78': fnLanguageSwitch( '50-100人' ),
		'2846ad11-7be5-41f2-88e1-962fb280318b': fnLanguageSwitch( '100-500人' ),
		'f813fa19-1777-4d40-b739-3597bdf4c13f': fnLanguageSwitch( '500人以上' )
	}
}

// 当前状态
function fnCurrentStatusJson(){
	return {
		'0': fnLanguageSwitch( '关闭' ),
		'1': fnLanguageSwitch( '开放' ),
		'2': fnLanguageSwitch( '重开放' ),
		'3': fnLanguageSwitch( '重关闭' ),
		'4': fnLanguageSwitch( '排队' )
	}
}


// 获取前后一年
function fnOneYearBeforeAndAfterJson(){
	var _d = new Date(),
		_result = {};
	_d.setFullYear( _d.getFullYear()-1 );
	for( var i = 0; i <= 24; i++ ){
		_result[ _d.Format( 'yyyy-MM' ) ] = _d.Format( 'yyyy-MM' );
		_d.setMonth( _d.getMonth() + 1 );
	};
	return _result;
}


// 技术支持状态
function fnTechnicalSupportStatusJson(){
	return {
		'1': {
			path: 'schematic',
			name: fnLanguageSwitch( '原理图审阅' )
		},
		'2': {
			path: 'promotion',
			name: fnLanguageSwitch( '产品推广&资金支持方案推广' )
		},
		'3': {
			path: 'sample',
			name: fnLanguageSwitch( '免费样片' )
		},
		'4': {
			path: 'pricing',
			name: fnLanguageSwitch( '竞争性价格支持' )
		},
		'5': {
			path: 'edc',
			name: fnLanguageSwitch( 'EDC特权帐号' )
		},
		'6': {
			path: 'doc',
			name: fnLanguageSwitch( '技术文档申请' )
		},
		'7': {
			path: 'debug',
			name: fnLanguageSwitch( '项目Debug' )
		},
		'8': {
			path: 'inquiry',
			name: fnLanguageSwitch( '资讯方案讨论' )
		},
		'9': {
			path: 'crb',
			name: fnLanguageSwitch( '开发板借测' )
		}
	}
}

    // 获取图片
    function fnGetPicture( el, cb ) {
        api.actionSheet({
            cancelTitle: fnLanguageSwitch( '取消' ),
            buttons: [ fnLanguageSwitch( '拍照上传' ), fnLanguageSwitch( '手机相册' )]
        }, function (ret, err) {
        	var _type = 'library';
            if (ret.buttonIndex == 1) {
                _type = 'camera';
            }
            
            if( ret.buttonIndex !== 3 ){
                api.getPicture({
		          sourceType: _type,
		          encodingType: 'png',
		          mediaValue: 'pic',
		          destinationType: 'url',
		          allowEdit: true,
		          quality: 50,
		          saveToPhotoAlbum: false
		      }, function (ret, err) {
		          if (ret && ret.data) {
	                  fnAjax({
				            url: 'files/upload',
					        data: {
					        	files: {
					        		file: ret.data
					        	}
					        },
                            cache: false,
//          				progress: true 
				        }, function( ret, err ){
				        	if( ret ){
			    				$api.attr(el, 'data-selectorid', ret.url);
			    				getImageCache( el );
								cb && cb( ret.url );
				            }else{
				                api.toast({
									global: true,
				                    msg: fnLanguageSwitch( fnErrorJson( err.body.error.message ) )
				                });
				            }
				        });
		          }
		      });
            }
        });
    }



// 调用selector
var UICustomPickerElement,
    UICustomPickerId,
    selectorValue,
    selectorId;

function openSelector(el, data, cb, filter){
	$api.dom( 'input:focus' ) && $api.dom( 'input:focus' ).blur();
    if( ! $api.hasCls(el, 'open') ){
	    api.showProgress({
	        title: fnLanguageSwitch( '加载中...' ),
	        text: fnLanguageSwitch( '请稍后...' ),
	        modal: true
	    });
        UICustomPicker = api.require('UICustomPicker');
        ! $api.dom( '#modal_selector' ) &&
    	$api.append($api.dom( 'body' ), 
        '<div id="modal_selector" tapmode onclick="selectCancel()">'+
        '    <div class="select">'+
        '        <div class="select-control">'+
        '            <div class="select-control-cancel" tapmode="" onclick="selectCancel()">'+fnLanguageSwitch( '取消' )+'</div>'+
        '            <div class="select-control-placeHolder"></div>'+
        '            <div class="select-control-ok" tapmode="" onclick="selectCancel()">'+fnLanguageSwitch( '完成' )+'</div>'+
        '        </div>'+
        '        <div class="select-content"></div>'+
        '    </div>'+
        '</div>');
        $api.addCls(el, 'open');
        setTimeout(function(){
        	api.hideProgress();
            var scope = [];
            if( data instanceof Array ){
                for( var x in data ){
                    scope.push({
                        value: fnLanguageSwitch( data[x].name || data[x] ),
                        id: data[x].id || data[x]
                    });
                }
            }else{
                for( var x in data ){
                    scope.push({
                        value: fnLanguageSwitch( data[x] ),
                        id: x
                    });
                }
            }
            UICustomPickerElement = el;
            $api.addCls($api.dom('body'), 'selector-modal-show');
            var UICustomPickerContentOffset = $api.offset($api.dom('.select-content'));
            UICustomPicker.open({
                rect: {
                    y: api.frameHeight - UICustomPickerContentOffset.h,
                    h: UICustomPickerContentOffset.h
                },
                styles: {
                    bg: 'rgba(0,0,0,0)',
                    normalColor: '#959595',
                    selectedColor: '#3685dd',
                    selectedSize: 18,
                    tagColor: '#3685dd',
                    tagSize: 10
                },
                data: [{
                    scope: scope
                }],
                autoHide: false,
                rows: 5,
                fixedOn: api.frameName,
                fixed: true
            }, function( ret, err ){
                UICustomPickerId = ret.id;
                if(ret){
                    // console.log( JSON.stringify( ret ) );
                    if(ret.eventType=='show'){
                        selectorValue = scope[0].value;
                        selectorId = scope[0].id;
                    }else{
                        selectorValue = ret.data[0].value;
                        selectorId = ret.data[0].id;
                    }
                    selectOK();
                    cb && cb( selectorId );
                }
            });
        },600);
    }
};
function selectCancel() {
    UICustomPicker.close({
        id: UICustomPickerId
    });
    $api.removeCls($api.dom('body'), 'selector-modal-show');
    $api.removeCls(UICustomPickerElement, 'open');
    if( event ){event.cancelBubble = true;}
    return false;
};

function selectOK() {
    if (UICustomPickerElement.tagName.toLowerCase() == 'input') {
        $api.val(UICustomPickerElement, selectorValue);
        $api.attr(UICustomPickerElement, 'data-selectorid', selectorId);
    } else {
        $api.html(UICustomPickerElement, selectorValue);
        $api.attr(UICustomPickerElement, 'data-selectorid', selectorId);
    }
    if( event ){event.cancelBubble = true;}
    return false;
};