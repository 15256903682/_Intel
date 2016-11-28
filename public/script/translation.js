function fnUpgrade(){
    var account = $api.getStorage('loginInfo');
    api.showProgress({
        title: '',
        text: '',
        modal: true
    });
    var move = isHuawei();
    var animation = {};
    if (move) {
        animation = {
            type: 'movein',
            subType: 'from_right'
        }          
    }
    ajaxRequest('APPUserInfo/IfApplyRoleTurn.aspx', 'get', {
        UserID: account.userid,
        BatchNo: account.batchno,
    }, function (ret, err) {
    	if( ret.res == 1 ){
    		if( localStorage.getItem('app_language') === 'en' ){
    			alert( ' You have applied to upgrade to enterprise users. Please do not repeat the operation. Thanks!' );
    		}else{
    			alert( '您已经申请升级成企业用户，请不要重复操作，谢谢!' );
    		}
    	}else if( ret.res == 0 ){
		    ajaxRequest('APPUserInfo/IfUserInfoPerfect.aspx', 'get', {
		        UserID: account.userid,
		        BatchNo: account.batchno,
		    }, function (ret, err) {
		        if (ret && ret.res == 1) {
		            api.openWin({
		                name: 'upgrade_win',
		                url: 'widget://' + DIR + '/member_center/upgrade.html',
		                bounces: false,
		                vScrollBarEnabled: false,
		                hScrollBarEnabled: false,
		                animation: animation
		            });
		        } else {
		            api.alert({
		                title: '提醒',
		                msg: '您的个人信息尚未完善，请先完善信息'
		            }, function () {
		                api.openWin({
		                    name: 'profile_win',
		                    url: 'widget://' + DIR + '/member_center/profile.html',
		                    bounces: false,
		                    animation: animation,
		                    pageParam: {
		                    	hasUpgrade: true
		                    }
		                });
		            });
		        }
		        if (err) {
		            api.toast({
	global: true,
		                msg: JSON.stringify(err),
		                duration: 2000,
		                location: 'middle'
		            });
		        }
		    });
    	}else{
    		alert( JSON.stringify( err )　)
    	}
        api.hideProgress();
    })
}

function fnVerifyInput( obj ){
	if( obj.type === 'number' ){
		var reg = /[^\d]/ig;
		if( reg.test( obj.el.value ) ){
			obj.el.value = obj.el.value.replace( /[^\d]/ig, '' );
			api.toast({
	global: true,
			    msg: '请输入数字'
			});
		}
	}
}


function fnTranslation( value, translation ){
   var vtranslation = {
   		'账户审核未通过': 'Account audit failed',
   		'个人转企业申请提交成功，我们的工作人员会尽快和您联系,请耐心等待': 'The  application for upgrading to enterprise users has been submitted successfully, our staff will contact you as soon as possible, please be patient .',
   		'个人转企业申请提交失败': 'The  application for upgrading to enterprise users has been submitted failed',
   		'个人转企业申请提交失败,请重新尝试': 'The  application for upgrading to enterprise users has been submitted failed, please try again',
   		'亲，都输错五次了，冷静一下，五分钟后再来吧': 'Pro, wrong five times, to calm down, come back in five minutes',
   		'个人转企业申请提交成功,我们的工作人员会尽快和您联系,请耐心等待': 'The  application for upgrading to enterprise users has been submitted successfully, our staff will contact you as soon as possible, please be patient .',
   		'英特尔其他产品': 'Other products of Intel',
        '请选择': '--Select--',
        '---请选择---': '--Select--',
        '--请选择--': '--Select--',
        '——-请选择——-': '--Select--',
        '可穿戴设备': 'Wearable',
        '车载/车联网': 'Telematics',
        '智能家居设备': 'Digital Home',
        '机器人': 'Robot',
        '其他': 'Others',
        '其它': 'Others',
        '刀片/单板': 'Blade, for veneer-cutting machine',
        '通讯基础设备': 'Communications infrastructure',
        '数字安全监控': 'Digital Security Surveillance',
        '新能源': 'New energy',
        '电子白板': 'Electronic Whiteboard',
        '游戏机': 'Games',
        '健身设备': 'Fitness equipment',
        '车载多媒体设备': 'Vehicle-mounted multimedia devices',
        '工业自动化': 'industrial automation',
        '工业人机界面': 'industrial interactive interface',
        '工业设备（其他）': 'Industrial equipment (Others)',
        '工业PC': 'Industrial PC',
        '网络会议': 'NetMeeting',
        '物联网': 'IoT',
        '医疗': 'Medical',
        '打印成像': '3D Printing',
        '数字标牌': 'Digital Signage',
        '自动贩卖机': 'Vending Machine Service',
        '信息亭': 'Information Kiosk',
        '瘦客户机': 'Thin-Client',
        '存储系统': 'Memory System',
        '智能交通': 'ITS',
        '平板': 'Panel',
        '网络安全': 'Internet Security',
        //  Application
        '原型完成': 'Prototype',
        '项目研发': 'Cultivate',
        '项目预研': 'Design',
        '项目量产': 'Production',
        //status
        '自研主板': 'Self-development',
        '外购主板': 'Purchase from others',
        //Type of Motherboard
        '模具 / 手版打样/ID工业设计/ 结构设计 ': 'Mockup/ID Design/Mechanical Design',
        '基于Intel芯片的设计和生产': 'Motherboard Design and MFG based on IA',
        '基于Intel 芯片的设计': 'Motherboard Design and MFG based on IA',
        '接口板的设计+生产': 'Baseboard Design and MFG',
        '整机生产和组装厂': 'Whole-set Assembly and MFG',
        //Add a request_type
        '产业链对接': 'Matchmaking',
        '技术文档申请': 'Tech Doc',
        '咨询方案讨论': 'Inquiry',
        'EDC特权帐号': 'EDC A/C',
        'EDC特权账号': 'EDC A/C',
        '开发板借测': 'CRB Loan',
        '原理图审阅': 'Schematic Review',
        '项目Debug': 'Debug',
        '免费样片': 'Free Sample',
        '方案推广': 'Promotion',
        '竞争性价格支持': 'Pricing',
        '技术信息咨询': 'IT Consultation',
        '开发板（CRB）借测及评估平台购买': 'CRB Loan',
        '资讯窗口&方案讨论': 'Inquiry',
        '评估平台参考设计（FFRD）支持': 'FFRD support',
        '关闭': 'Closed',
        '开放': 'Open',
        '重开放': 'Re-open',
        '重关闭': 'Re-close',
        //Support History_Tech Doc
        '研发工程师': 'Engineer',
        '管理人员': 'General Manager',
        '销售': 'Sales',
        '产品经理': 'Product Manager',
        '市场经理': 'Marketing Manager',
        '行政人员': 'Administrator',
        '商务经理': 'Business Manager',
        '采购经理': 'Sourcing Manager',
        //  EDC A/C title
        'test开发板': 'test CRB',
        '开发套件借测（Bay Trail I）': 'Bay Trail I Dev. Kit',
        'Galileo 开发板借测': 'Galileo CRB',
        'Cherry Trail-T4开发套件销售': 'Cherry Trail-T4 Dev. Kit',
        'Sofia 3G开发套件借测': 'Sofia 3G Dev. Kit',
        'Cherry Hill开发板借测': 'Cherry Hill CRB',
        '电脑棒STCK1A32WFC': 'Compute Stick STCK1A32WFC',
        '英特尔实感3D摄像头（F200)': 'Intel Realsense 3D Camera(F200)',
        '面向Arduino的Edison开发套件': 'Arduino Based Edison Dev. Kit',
        'Quark 核心模块 开发套件借测': 'Quark Core Model Dev. Kit ',
        'BayTrail-M LIVA开发套件': 'BayTrail-M LIVA Dev. Kit ',
        'Galileo Gen 2 开发板借测': 'Galileo Gen 2 CRB',
        //Project Management（TSNC）
        '竞争性\n价格\n支持': 'Pricing',
        '方案\n推广 ': 'Promotion',
        '免费\n样片': 'Free Sample',
        '项目\nDebug': 'Debug',
        '原理图\n审阅': 'Schematic Review',
        'EDC\n特权\n账号': 'EDC A/C',
        '咨询\n方案\n讨论': 'Inquiry',
        '技术\n文档\n申请': 'Tech Doc',
        '产业链\n对接': 'Matchmaking',
        '技术\n信息\n咨询': 'IT Consultation',
        '开发板\n（CRB）\n借测': 'CRB Loan',
        '0-50人': 'Below 50 people',
        '0 - 50人': 'Below 50 people',
        '0-10人': 'Below 10 people',
        '10-20人': '10-20 people',
        '10-20人 ': '10-20 people',
        '20-50人': '20-50 people',
        '50人以上': 'Above 50 people',
        '50人以下': 'Below 50 people',
        '0 - 10人': 'Below 10 people',
        '500-1000万': '5-10 million',
        '50-100人': '50-100 people',
        '50-100人 ': '50-100 people',
        '100-200人': '100-200 people',
        '200-500人': '200-500 people',
        '500人以上': 'Above 500 people',
		'200万以下': 'Below 2 million',
		'200-500万': '2-5 million',
		'1000-5000万': '10-50 million',
		'5000万以上': 'Above 50 million',
        '提交成功！' : 'submitted successfully!',
        //Title
        '采购' : 'Buyer',
        '助理' : 'Assistant',
        '工程师' : 'Engineer',
        '经理' : 'Manager',
        '总监' : 'Director',
        '总经理' : 'General Manager',
        '投资机构(VC)' : 'VC',
        '独立软件开发商(ISV)' : 'ISV',
        '互联网软件与服务公司(Internet)' : 'Internet',
        '模具厂' : 'Mould Factory',
        '代工厂(EMS)' : 'EMS',
        '系统集成商(SI)' : 'SI',
        'ODM/OEM厂商' : 'sODM/OEM',
        '工业设计公司(ID)' : 'ID',
        '方案设计公司(IDH)' : 'IDH',
        '芯片厂商(IC)' : 'IC',
        '个人' : 'Individual',
        '初创公司' : 'Startup',
        '创客空间/加速器' : 'Space / accelerator',
        '供应链厂商' : 'Supply chain vendors',
        //Intel product type
        '爱迪生' : 'Edison',
        '伽利略' : 'Galileo',
        '夸克' : 'Quark',
        //验证
        '验证码错误': 'Wrong Verification Code',
        '提交成功': 'Successful submission',
        '请不要重复提交项目': 'Please dont repeat submit project',
        '没有这个项目阶段': 'Project Status does not exist.',
        '连接错误，请检查网络或者请求配置是否正确': 'Link error, please check the network configuration or request is correct',
        '获取验证码失败': 'Fail to obtain the verification code',
        '请您等一分钟后再来获取验证码': 'Please wait a minute and then get the verification code.',
        '您的邮箱格式不正确': 'Your E-mail format is not correct',
		'请不要重复上传此支持获取,如确有需要请在一分钟之后再提交': 'Please dont repeat the upload the support available, if indeed need to submit again after a minute',
		'此手机号已注册或绑定了其他账户，不能重复绑定！': 'This phone number has been registered or binding to other accounts, can\'t repeat binding! ',
        '你已经提交过报名，请不要重复提交': 'You have already submitted application, please do not submit a duplicate',
        '网络超时，请稍后重试': 'Network timeout, please try again later',
        //状态
        '审核中': 'In Review',
        '审批中': 'In Review',
        '审核不通过': 'Rejected',
        '审核通过': 'Pass',
        '审批通过': 'Pass',
        '审批不通过': 'Rejected',
        '审批删除': 'Approval delete',
        '已发布' : 'Published',
        '沟通中' : 'Ongoing',
        '合作确认中' : 'Confirming',
        '对接成功' : 'Matched',
        '失败' : 'Failed',
        '新需求' : 'New',
        
        
        '已报名' : 'Have to sign up',
        '已参加' : 'Haveto attend',
        '活动报名中' : 'Activity applicants',
        '活动已结束' : 'Activity has ended',
        length: true
    }; 
    
    var num = 0;
    for( var x in vtranslation ){
        if( translation ){
           if( x == value  ){
               return vtranslation[x];
           }
        }else{
           if( vtranslation[x] == value  ){
               return x;
           }
        }
        if( x === 'length' ){
            return value;
        }
    }
}


function fnFormatDate( value, translation){
    if( translation ){
        if( value.indexOf( '/' ) === -1 ){
            var format = value.match( /[0-9]*/g );
            return format[0]+'/'+format[2];
        }else{
            return value;
        }
    }else{
        var format = value.split('/');
        return format[0]+'年'+format[1]+'月';
    }
}