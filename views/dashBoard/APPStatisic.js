var widt = 60;
var loginInfo = $api.getStorage('loginInfo');
var bodyParam = {
    UserID: loginInfo.userid,
    BatchNo: loginInfo.batchno
};
function APPGetPartnerData() {
        // dashboard
        fnAjax({
            url: 'users/dashboard',
            method: 'post'
        }, function( ret, err ){
            if( ret ){
                var DataWidth = api.frameWidth - 10;
                var pieheight = 450;
                if( fnIsEmp( ret.data0 ) ){
                    $("#ALLMember").html( fnStringEmpty( ret.data0.PeopleNum ) );
                    $("#PersonalMember").html( fnStringEmpty( ret.data0.PersonalNum ) );
                    $("#EnterpriseMember").html( fnStringEmpty( ret.data0.EnterpriseNum ) );
                }
                if( fnIsEmp( ret.data1 ) && ret.data1.length ){
                    var data1 = ret.data1;
                    var divtable = "";
                    var value1 = [];
                    var name1 = [];
                    for (var i = 0; i < data1.length; i++) {
                        name1.push(data1[i].name);
                        value1.push(data1[i].value);
                    }
                    $(function () {
                        //set line value
                        var line = 0;
                        //set column value
                        var list = 2;
                        if (name1.length > 5) {
                            line = 5;
                            createtabledata(line, list, name1, value1);
                            $('#more_btn').show();
                            $('#more_btn a').click(function () {
                                line = name1.length;
                                $('#more_btn').hide();
                                $('#MemberRegion').html('');
                                createtabledata(line, list, name1, value1);
                            });
                        }
                        else {
                            line = name1.length;
                            createtabledata(line, list, name1, value1);
                        }
                    });
                }else{
                    $('#more_btn').hide();
                    $('#MemberRegion').html('没有数据');
                }

                if( fnIsEmp( ret.data2 ) && ret.data2.length ){
                    var data2 = ret.data2;
                    var value2 = [];
                    var name2 = [];
                    var scaleData2 = 0;
                    for (var i = 0; i < data2.length; i++) {
                        if(i == data2.length-1){
                            name2.push(data2[i].name.split('-')[1]);
                        }else{
                            name2.push(data2[i].name);
                        }
                        value2.push(data2[i].value);
                        if (scaleData2 < parseInt(data2[i].value)) {
                            scaleData2 = data2[i].value;
                        }
                    }
                    scaleData2 = getscaleData(scaleData2);
                    $(function () {
                        var registerData1 = [
                            {
                                name: 'RegisterData',
                                value: value2,
                                color: '#0d8ecf',
                                line_width: 2
                            }];
                        var labels = name2;
                        var line = new iChart.LineBasic2D({
                            render: 'registerData1',
                            data: registerData1,
                            align: 'center',
                            width: DataWidth,
                            height: 450,
                            title: {
                                text: "",
                                color: "#3e576f",
                                fontsize: 40,
                                font: "微软雅黑",
                                textAlign: "left",
                                height: 30,
                                offsetx: 30,
                                offsety: 0
                            },
                            subtitle: {
                                text: "",
                                color: "#3e576f",
                                fontsize: 40,
                                font: "微软雅黑",
                                textAlign: "left",
                                height: 20,
                                offsetx: 30,
                                offsety: 0
                            },
                            footnote: {
                                text: "",
                                color: "#c0c0c0",
                                fontsize: 40,
                                font: "微软雅黑",
                                textAlign: "right",
                                height: 20,
                                offsetx: 0,
                                offsety: 0
                            },
                            border: {
                                color: "#bcbcbc",
                                width: 0
                            },
                            sub_option: {
                                smooth: true, //smoothed curve
                                point_size: 10,
                                label: {
                                    fontweight: 200,
                                    color: "#0d8ecf",
                                    fontsize:13,
                                    offsetx: -5,
                                    offsety: 0
                                }
                            },
                            tip: {
                                enable: true,
                                shadow: true
                            },
                            legend: {
                                enable: false
                            },
                            crosshair: {
                                enable: true,
                                line_color: '#62bce9'
                            },
                            coordinate: {
                                //width: a[0] - widt,
                                // valid_width: a[0],
                                // height: 400,
                                width: "90%",
                                valid_width: "99%",
                                height: "85%",
                                offsetx: 0,
                                offsety: 0,
                                axis: {
                                    color: "#666791",
                                    width: ["", "", 1, ""],
                                    enable: true
                                },
                                //Custom Grid
                                //   grids: {
                                //       vertical: {
                                //       way: 'given_value',
                                //       value: aaa
                                //     }
                                //   },
                                scale: [{
                                    position: 'left',
                                    start_scale: 0,
                                    //end_scale: 100,
                                    scale_space: scaleData2,
                                    scale_size: 2,
                                    scale_color: '#9f9f9f',
                                    label: {
                                        fontweight: 200,
                                        color: "#4572a7",
                                        fontsize:13
                                    },
                                    listeners: {
                                        parseText: function (t, x, y) {
                                            return {text: Math.ceil(t)}
                                        }
                                    }
                                }, {
                                    position: 'bottom',
                                    labels: labels,
                                    label: {
                                        fontweight: 200,
                                        color: "#4572a7",
                                        fontsize:13
                                    }

                                }]
                            }
                        });
                        line.draw();
                    });
                }else{

                }

                if( fnIsEmp( ret.data3 ) && ret.data3.length ){
                    var data3 = ret.data3;
                    var scaleData3 = 0;
                    var value3 = [];
                    var name3 = [];
                    for (var i = 0; i < data3.length; i++) {
                        if(i == data3.length-1){
                            name3.push(data3[i].name.split('-')[1]);
                        }else{
                            name3.push(data3[i].name);
                        }
                        value3.push(data3[i].value);
                        if (scaleData3 < parseInt(data3[i].value)) {
                            scaleData3 = data3[i].value;
                        }
                    }
                    scaleData3 = getscaleData(scaleData3);
                    $(function () {
                        var registerData2 = [
                            {
                                name: 'RegisterData',
                                value: value3,
                                color: '#0d8ecf',
                                line_width: 2
                            }];
                        var labels = name3;
                        var line = new iChart.LineBasic2D({
                            render: 'registerData2',
                            data: registerData2,
                            align: 'center',
                            width: DataWidth,
                            height: 450,
                            decimalsnum: 0,
                            title: {
                                text: "",
                                color: "#3e576f",
                                fontsize: 13,
                                font: "微软雅黑",
                                textAlign: "left",
                                height: 30,
                                offsetx: 0,
                                offsety: 0
                            },
                            subtitle: {
                                text: "",
                                color: "#3e576f",
                                fontsize: 13,
                                font: "微软雅黑",
                                textAlign: "left",
                                height: 20,
                                offsetx: 30,
                                offsety: 0
                            },
                            footnote: {
                                text: "",
                                color: "#c0c0c0",
                                fontsize: 12,
                                font: "微软雅黑",
                                textAlign: "right",
                                height: 20,
                                offsetx: 0,
                                offsety: 0
                            },
                            border: {
                                color: "#bcbcbc",
                                width: 0
                            },
                            sub_option: {
                                smooth: true, //smoothed curve
                                point_size: 10,
                                label: {
                                    fontweight: 200,
                                    color: "#0d8ecf",
                                    fontsize: 13,
                                    offsetx: 5,
                                    offsety: 0
                                }
                            },
                            tip: {
                                enable: false,
                                shadow: true
                            },
                            legend: {
                                enable: false
                            },
                            crosshair: {
                                enable: false,
                                line_color: '#62bce9'
                            },
                            coordinate: {
                                //width: a[0] - widt,
                                // valid_width: a[0],
                                // height: 400,
                                width: "90%",
                                valid_width: "99%",
                                height: "85%",
                                offsetx: 0,
                                offsety: 0,
                                axis: {
                                    color: "#666791",
                                    width: ["", "", 1, ""],
                                    enable: true
                                },
                                //Custom Grid
                                //   grids: {
                                //       vertical: {
                                //       way: 'given_value',
                                //       value: aaa
                                //     }
                                //   },
                                scale: [{
                                    position: 'left',
                                    start_scale: 0,
                                    //end_scale: 100,
                                    scale_space: scaleData3,
                                    scale_size: 2,
                                    scale_color: '#9f9f9f',
                                    label: {
                                        fontweight: 200,
                                        color: "#4572a7",
                                        fontsize: 13
                                    },
                                    listeners: {
                                        parseText: function (t, x, y) {
                                            return {text: Math.ceil(t)}
                                        }
                                    }
                                }, {
                                    position: 'bottom',
                                    labels: labels,
                                    label: {
                                        fontweight: 200,
                                        color: "#4572a7",
                                        fontsize: 13
                                    }

                                }]
                            }
                        });

                        //drawing
                        line.draw();
                    });

                }else{
                    
                }


                if( fnIsEmp( ret.data4 ) && ret.data4.length ){
                    var data4 = ret.data4;
                    var value4 = [];
                    var name4 = [];
                    var scaleData4 = 0;
                    for (var i = 0; i < data4.length; i++) {
                        name4.push(data4[i].name);
                        value4.push(data4[i].value);
                        if (scaleData4 < parseInt(data4[i].value)) {
                            scaleData4 = data4[i].value;
                        }
                    }
                    scaleData4 = getscaleData(scaleData4);
                    $(function () {
                        var registerData3 = [
                            {
                                name: 'RegisterData',
                                value: value4,
                                color: '#0d8ecf',
                                line_width: 2
                            }];
                        var labels = name4;
                        var line = new iChart.LineBasic2D({
                            render: 'registerData3',
                            data: registerData3,
                            align: 'center',
                            width: DataWidth,
                            height: 450,
                            title: {
                                text: "",
                                color: "#3e576f",
                                fontsize: 13,
                                font: "微软雅黑",
                                textAlign: "left",
                                height: 30,
                                offsetx: 30,
                                offsety: 0
                            },
                            subtitle: {
                                text: "",
                                color: "#3e576f",
                                fontsize: 13,
                                font: "微软雅黑",
                                textAlign: "left",
                                height: 20,
                                offsetx: 30,
                                offsety: 0
                            },
                            footnote: {
                                text: "",
                                color: "#c0c0c0",
                                fontsize: 12,
                                font: "微软雅黑",
                                textAlign: "right",
                                height: 20,
                                offsetx: 0,
                                offsety: 0
                            },
                            border: {
                                color: "#bcbcbc",
                                width: 0
                            },
                            sub_option: {
                                smooth: true, //smoothed curve
                                point_size: 10,
                                label: {
                                    fontweight: 200,
                                    color: "#0d8ecf",
                                    fontsize: 13,
                                    offsetx: 5,
                                    offsety: 0
                                }
                            },
                            tip: {
                                enable: false,
                                shadow: true
                            },
                            legend: {
                                enable: false
                            },
                            crosshair: {
                                enable: false,
                                line_color: '#62bce9'
                            },
                            coordinate: {
                                //width: a[0] - widt,
                                // valid_width: a[0],
                                // height: 400,
                                width: "90%",
                                valid_width: "99%",
                                height: "85%",
                                offsetx: 0,
                                offsety: 0,
                                axis: {
                                    color: "#666791",
                                    width: ["", "", 1, ""],
                                    enable: true
                                },
                                //Custom Grid
                                //   grids: {
                                //       vertical: {
                                //       way: 'given_value',
                                //       value: aaa
                                //     }
                                //   },
                                scale: [{
                                    position: 'left',
                                    start_scale: 0,
                                    //end_scale: 100,
                                    scale_space: scaleData4,
                                    scale_size: 2,
                                    scale_color: '#9f9f9f',
                                    label: {
                                        fontweight: 200,
                                        color: "#4572a7",
                                        fontsize: 13
                                    },
                                    listeners: {
                                        parseText: function (t, x, y) {
                                            return {text: Math.ceil(t)}
                                        }
                                    }
                                }, {
                                    position: 'bottom',
                                    labels: labels,
                                    label: {
                                        fontweight: 200,
                                        color: "#4572a7",
                                        fontsize: 13
                                    }

                                }]
                            }
                        });

                        //Start drawing
                        line.draw();
                    });

                }else{
                    
                }


                if( fnIsEmp( ret.data5 ) && ret.data5.length ){
                    var data5 = ret.data5;
                    var value5 = [];
                    var name5 = [];
                    var scaleData5 = 0;
                    for (var i = 0; i < data5.length; i++) {
                        name5.push(data5[i].name);
                        value5.push(data5[i].value);
                        if (scaleData5 < parseInt(data5[i].value)) {
                            scaleData5 = data5[i].value;
                        }
                    }
                    scaleData5 = getscaleData(scaleData5);
                    $(function () {
                        var DayLoginData = [
                            {
                                name: 'DAU',
                                value: value5,
                                color: '#0d8ecf',
                                line_width: 2
                            }];
                        var labels = name5;
                        var line = new iChart.LineBasic2D({
                            render: 'DayLoginData',
                            data: DayLoginData,
                            align: 'center',
                            width: DataWidth,
                            height: 450,
                            title: {
                                text: "",
                                color: "#3e576f",
                                fontsize: 26,
                                font: "微软雅黑",
                                textAlign: "left",
                                height: 0,
                                offsetx: 0,
                                offsety: 0
                            },
                            subtitle: {
                                text: "",
                                color: "#3e576f",
                                fontsize: 16,
                                font: "微软雅黑",
                                textAlign: "left",
                                height: 0,
                                offsetx: 30,
                                offsety: 0
                            },
                            footnote: {
                                text: "",
                                color: "#c0c0c0",
                                fontsize: 12,
                                font: "微软雅黑",
                                textAlign: "right",
                                height: 20,
                                offsetx: 0,
                                offsety: 0
                            },
                            border: {
                                color: "#bcbcbc",
                                width: 0
                            },
                            sub_option: {
                                smooth: true, //smoothed curve
                                point_size: 10,
                                label: {
                                    fontweight: 200,
                                    color: "#0d8ecf",
                                    fontsize: 13,
                                    offsetx: 10,
                                    offsety: 0
                                }
                            },
                            tip: {
                                enable: false,
                                shadow: true
                            },
                            legend: {
                                enable: false
                            },
                            crosshair: {
                                enable: false,
                                line_color: '#62bce9'
                            },
                            coordinate: {
                                //width: a[0] - widt,
                                // valid_width: a[0],
                                // height: 400,
                                width: "90%",
                                valid_width: "99%",
                                height: "85%",
                                offsetx: 0,
                                offsety: 0,
                                axis: {
                                    color: "#666791",
                                    width: ["", "", 1, ""],
                                    enable: true
                                },

                                //Custom Grid
                                //   grids: {
                                //       vertical: {
                                //       way: 'given_value',
                                //       value: aaa
                                //     }
                                //   },
                                scale: [{
                                    position: 'left',
                                    start_scale: 0,
                                    //end_scale: 100,
                                    scale_space: scaleData5,
                                    scale_size: 2,
                                    scale_color: '#9f9f9f',
                                    label: {
                                        fontweight: 200,
                                        color: "#4572a7",
                                        fontsize: 13
                                    },
                                    listeners: {
                                        parseText: function (t, x, y) {
                                            return {text: Math.ceil(t)}
                                        }
                                    }
                                }, {
                                    position: 'bottom',
                                    labels: labels,
                                    label: {
                                        fontweight: 200,
                                        color: "#4572a7",
                                        fontsize: 13
                                    }

                                }]
                            }
                        });

                        line.draw();
                    });

                }else{
                    
                }




                if( fnIsEmp( ret.data6 ) && ret.data6.length ){
                    var data6 = ret.data6;
                    var value6 = [];
                    var name6 = [];
                    var scaleData6 = 0;
                    for (var i = 0; i < data6.length; i++) {
                        name6.push(data6[i].name);
                        value6.push(data6[i].value);
                        if (scaleData6 < parseInt(data6[i].value)) {
                            scaleData6 = data6[i].value;
                        }
                    }
                    scaleData6 = getscaleData(scaleData6);
                    // console.log(scaleData6);
                    $(function () {
                        var MemberTrainingData = [
                            {
                                name: 'Active',
                                value: value6,
                                color: '#0d8ecf',
                                line_width: 2
                            }];
                        var labels = name6;
                        var line = new iChart.LineBasic2D({
                            render: 'MemberTraining',
                            data: MemberTrainingData,
                            align: 'center',
                            width: DataWidth,
                            height: 450,
                            title: {
                                text: "",
                                color: "#3e576f",
                                fontsize: 26,
                                font: "微软雅黑",
                                textAlign: "left",
                                height: 30,
                                offsetx: 30,
                                offsety: 0
                            },
                            subtitle: {
                                text: "",
                                color: "#3e576f",
                                fontsize: 16,
                                font: "微软雅黑",
                                textAlign: "left",
                                height: 20,
                                offsetx: 30,
                                offsety: 0
                            },
                            footnote: {
                                text: "",
                                color: "#c0c0c0",
                                fontsize: 12,
                                font: "微软雅黑",
                                textAlign: "right",
                                height: 20,
                                offsetx: 0,
                                offsety: 0
                            },
                            border: {
                                color: "#bcbcbc",
                                width: 0
                            },
                            sub_option: {
                                smooth: true, //smoothed curve
                                point_size: 10,
                                label: {
                                    fontweight: 200,
                                    color: "#0d8ecf",
                                    fontsize: 14,
                                    offsetx: 5,
                                    offsety: 0
                                }
                            },
                            tip: {
                                enable: false,
                                shadow: true
                            },
                            legend: {
                                enable: false
                            },
                            crosshair: {
                                enable: false,
                                line_color: '#62bce9'
                            },
                            coordinate: {
                                //width: a[0] - widt,
                                // valid_width: a[0],
                                // height: 400,
                                width: "90%",
                                valid_width: "99%",
                                height: "85%",
                                offsetx: 0,
                                offsety: 0,
                                axis: {
                                    color: "#666791",
                                    width: ["", "", 1, ""],
                                    enable: true
                                },

                                //Custom Grid
                                //   grids: {
                                //       vertical: {
                                //       way: 'given_value',
                                //       value: aaa
                                //     }
                                //   },
                                scale: [{
                                    position: 'left',
                                    start_scale: 0,
                                    //end_scale: 100,
                                    scale_space: scaleData6,
                                    scale_size: 2,
                                    scale_color: '#9f9f9f',
                                    label: {
                                        fontweight: 200,
                                        color: "#4572a7",
                                        fontsize: 13
                                    },
                                    listeners: {
                                        parseText: function (t, x, y) {
                                            return {text: Math.ceil(t)}
                                        }
                                    }
                                }, {
                                    position: 'bottom',
                                    labels: labels,
                                    label: {
                                        fontweight: 200,
                                        color: "#4572a7",
                                        fontsize: 13
                                    }

                                }]
                            }
                        });

                        //开始画图
                        line.draw();
                    });

                }else{
                    
                }



                if( fnIsEmp( ret.data7 ) && ret.data7.length ){
                    var data7 = ret.data7;

                    var scaleData7 = 0;
                    var TotalNum7 = 0;
                    for (var i = 0; i < data7.length; i++) {
                        TotalNum7 = TotalNum7 + parseInt(data7[i].value);
                        if (scaleData7 < parseInt(data7[i].value)) {
                            scaleData7 = data7[i].value;
                        }
                    }
                    scaleData7 = getscaleData(scaleData7);
                    if (TotalNum7 == 0 || isNaN(TotalNum7)) {
                        TotalNum7 = 1
                    }
                    else {
                        TotalNum7 = TotalNum7;
                    }
                    $(function () {
                        var chart = iChart.create({
                            render: "Activejoin",
                            width: DataWidth,
                            height: 450,
                            background_color: "#fdfdfd",
                            gradient: false,
                            color_factor: 0.2,
                            border: {
                                color: "#3e1c3e",
                                width: 0
                            },
                            align: "center",
                            offsetx: 0,
                            offsety: -30,
                            sub_option: {
                                border: {
                                    color: "#666791",
                                    width: 1
                                },
                                label: {
                                    fontweight: 600,
                                    fontsize: 16,
                                    color: "#4572a7",
                                    sign: "square",
                                    sign_size: 10,
                                    border: {
                                        color: "#BCBCBC",
                                        width: 1
                                    },
                                    background_color: "rgba(244,244,244,0)"
                                },
                                listeners: {
                                    parseText: function (d, t) {
                                        var a = d.get('value');
                                        var b = (Math.round(a / TotalNum7 * 10000) / 100.00 + "%");
                                        return a; // +"/" + b; //自定义label文本
                                    }
                                }
                            },
                            shadow: true,
                            shadow_color: "#666666",
                            shadow_blur: 5,
                            showpercent: false,
                            column_width: "60%",
                            bar_height: "60%",
                            radius: "60%",
                            title: {
                                text: "",
                                color: "#3e576f",
                                fontsize: 26,
                                font: "微软雅黑",
                                textAlign: "left",
                                height: 30,
                                offsetx: 0,
                                offsety: 0
                            },
                            subtitle: {
                                text: "",
                                color: "#3e576f",
                                fontsize: 16,
                                font: "微软雅黑",
                                textAlign: "left",
                                height: 24,
                                offsetx: 0,
                                offsety: 0
                            },
                            legend: {
                                enable: false,
                                sign: "round",
                                sign_size: 10,
                                legend_space: 10,
                                background_color: "#fefefe",
                                color: "#333333",
                                fontsize: 8,
                                border: {
                                    color: "#BCBCBC",
                                    width: 0
                                },
                                column: 9,
                                align: "left",
                                valign: "bottom",
                                offsetx: widt,
                                offsety: 0
                            },
                            footnote: {
                                text: "",
                                color: "#c0c0c0",
                                fontsize: 16,
                                font: "微软雅黑",
                                textAlign: "right",
                                height: 2,
                                offsetx: 0,
                                offsety: 0
                            },
                            coordinate: {
                                width: "90%",
                                height: "70%",
                                background_color: "rgba(246,246,246,0.1)",
                                axis: {
                                    color: "#666791",
                                    width: ["", "", 2, ""]
                                },
                                grid_color: "#c0c0c0",
                                scale: [{
                                    position: 'left',
                                    start_scale: 0,
                                    //// end_scale:100,
                                    scale_space: scaleData7,
                                    scale_size: 2,
                                    scale_color: '#9f9f9f',

                                    label: {
                                        fontweight: 100,
                                        color: "#3e576f",
                                        fontsize: 13
                                    },
                                    listeners: {
                                        parseText: function (t, x, y) {
                                            return {text: Math.ceil(t)}
                                        }
                                    }
                                }]
                            },
                            label: {
                                fontweight: 300,
                                color: "black",
                                fontsize: 13,
                                font: "微软雅黑,Arial,sans-serif"
                            },
                            type: "column2d",
                            data: data7
                        });
                        chart.draw();
                    });

                }else{
                    document.getElementById("Activejoin").innerHtml = "没有数据";
                }


                debugAlert( ret.data8 )
                if( fnIsEmp( ret.data8 ) && ret.data8.length ){
                    var data8 = ret.data8;

                    var TotalNum = 0;
                    for (var i = 0; i < data8.length; i++) {
                        //value8.push(data8[i].value);
                        TotalNum = TotalNum + parseInt(data8[i].value);
                    }
                    if (TotalNum == 0 || isNaN(TotalNum)) {
                        TotalNum = 1
                    }
                    else {
                        TotalNum = TotalNum;
                    }
                    $(function () {
                        var chart = iChart.create({
                            render: "MemberProject",
                            width: DataWidth,
                            height: pieheight,
                            background_color: "#fefefe",
                            gradient: false,
                            color_factor: 0.2,
                            border: {
                                color: "#bcbcbc",
                                width: 0
                            },
                            align: "center",
                            offsetx: 0,
                            offsety: -50,
                            sub_option: {
                                mini_label_threshold_angle: 60, //迷你label的阀值,单位:角度
                                mini_label: {//迷你label配置项
                                    fontsize: 13,
                                    fontweight: 600,
                                    color: '#ffffff'
                                },
                                border: {
                                    color: "#6d869f",
                                    width: 2
                                },
                                label: {
                                    sign: false,
                                    fontweight: 300,
                                    fontsize: 13,
                                    color: "#4572a7",
                                    // sign: "square",
                                    sign_size: null,
                                    border: {
                                        color: "#BCBCBC",
                                        width: 0
                                    },
                                    background_color: "rgba(244,244,244,0)"
                                },
                                listeners: {
                                    parseText: function (d, t) {
                                        var a = d.get('value');
                                        var b = (Math.round(a / TotalNum * 10000) / 100.00 + "%");
                                        if (a == 0) {
                                            return a + "/" + b; //自定义label文本
                                        }
                                        else {
                                            return a + "\n\n" + b; //自定义label文本
                                        }
                                    },
                                    click: function (r, e, m) {
                                        var move = isHuawei();
                                        var animation = {/*
                                            type:"none",
                                            subType:"from_right",
                                            duration:300*/
                                        };
                                        if (move) {
                                            animation = {
                                                type: 'movein',
                                                subType: 'from_right'
                                            }
                                        }
                                        api.openWin({
                                            name: 'win_APPpartnerProject',
                                            url: 'widget://' + DIR + '/dashBoard/win_APPpartnerProject.html',
                                            bounces: false,
                                            animation: animation,
                                            pageParam:{
                                                ProjectStatus:r.get('name')
                                            }
                                        });
                                    }
                                }
                            },
                            shadow: true,
                            shadow_color: "#666666",
                            shadow_blur: 5,
                            showpercent: false,
                            column_width: "70%",
                            bar_height: "70%",
                            radius: "90%",
                            title: {
                                text: "",
                                color: "#6d869f",
                                fontsize: 16,
                                textAlign: "left",
                                font: "微软雅黑",
                                height: 30,
                                offsetx: 0,
                                offsety: 0
                            },
                            subtitle: {
                                text: "",
                                color: "#111111",
                                fontsize: 13,
                                textAlign: "left",
                                font: "微软雅黑",
                                height: 20,
                                offsetx: 0,
                                offsety: 0
                            },
                            footnote: {
                                color: "#111111",
                                fontsize: 12,
                                textAlign: "right",
                                font: "微软雅黑",
                                height: 20,
                                offsetx: 0,
                                offsety: 0
                            },
                            legend: {
                                enable: true,
                                //background_color: "#fefefe",
                                //color: "#333333",
                                fontsize: 13,
                                border: {
                                    color: "#BCBCBC",
                                    width: 0
                                },
                                legend_space: 30,
                                column: 3,
                                align: "left",
                                valign: "bottom",
                                offsetx: 0,
                                offsety: 0  //,
                                // listeners: {
                                //   parseText: function(d, t) {
                                //      return d.get('value'); //自定义label文本
                                //   }
                                // }
                            },
                            coordinate: {
                                width: "80%",
                                height: "80%",
                                background_color: null,
                                axis: {
                                    color: "#bfbfc3",
                                    width: ["1", "1", 2, "1"]
                                },
                                grid_color: "#c0c0c0",
                                label: {
                                    fontweight: 500,
                                    color: "#f5f5f5",
                                    fontsize: 0
                                }
                            },
                            label: {
                                fontweight: 200,
                                color: "#666666",
                                fontsize: 6
                            },
                            type: "pie2d",
                            data: data8
                        });
                        chart.draw();
                    });
                }else{
                    document.getElementById("MemberProject").innerHtml = "没有数据";
                }


                if( fnIsEmp( ret.data9 ) && ret.data9.length ){
                    var data9 = ret.data9;

                    var TotalNum2 = 0;
                    for (var i = 0; i < data9.length; i++) {
                        //value8.push(data8[i].value);
                        TotalNum2 = TotalNum2 + parseInt(data9[i].value);
                    }
                    if (TotalNum2 == 0 || isNaN(TotalNum2)) {
                        TotalNum2 = 1
                    }
                    else {
                        TotalNum2 = TotalNum2;
                    }
                    $(function () {
                        var chart = iChart.create({
                            render: "DemandCategory",
                            width: DataWidth,
                            height: pieheight,
                            background_color: "#fefefe",
                            gradient: false,
                            color_factor: 0.2,
                            border: {
                                color: "#bcbcbc",
                                width: 0
                            },
                            align: "center",
                            offsetx: 0,
                            offsety: -50,
                            sub_option: {
                                mini_label_threshold_angle: 60, //迷你label的阀值,单位:角度
                                mini_label: {//迷你label配置项
                                    fontsize: 13,
                                    fontweight: 600,
                                    color: '#ffffff'
                                },
                                border: {
                                    color: "#6d869f",
                                    width: 0
                                },
                                label: {
                                    sign: false,
                                    fontweight: 300,
                                    fontsize: 13,
                                    color: "#4572a7",
                                    // sign: "square",
                                    sign_size: null,
                                    border: {
                                        color: "#BCBCBC",
                                        width: 0
                                    },

                                    background_color: "rgba(244,244,244,0)"

                                },
                                listeners: {
                                    parseText: function (d, t) {
                                        var a = d.get('value');
                                        var b = (Math.round(a / TotalNum2 * 10000) / 100.00 + "%");
                                        if (a == 0) {
                                            return a + "/" + b; //自定义label文本
                                        }
                                        else {
                                            return a + "\n\n" + b; //自定义label文本
                                        }
                                    }
                                }
                            },
                            shadow: true,
                            shadow_color: "#666666",
                            shadow_blur: 5,
                            showpercent: false,
                            column_width: "70%",
                            bar_height: "70%",
                            radius: "90%",
                            title: {
                                text: "",
                                color: "#6d869f",
                                fontsize: 13,
                                textAlign: "left",
                                font: "微软雅黑",
                                height: 2,
                                offsetx: 0,
                                offsety: 0
                            },
                            subtitle: {
                                text: "",
                                color: "#111111",
                                fontsize: 13,
                                textAlign: "left",
                                font: "微软雅黑",
                                height: 3,
                                offsetx: 0,
                                offsety: 0
                            },
                            footnote: {
                                color: "#111111",
                                fontsize: 12,
                                textAlign: "right",
                                font: "微软雅黑",
                                height: 20,
                                offsetx: 0,
                                offsety: 0
                            },
                            legend: {
                                enable: true,
                                // background_color: "#fefefe",
                                color: "black",
                                fontsize: 13,
                                border: {
                                    color: "#BCBCBC",
                                    width: 0
                                },
                                row: 3,
                                line_height: 30,
                                legend_space: 20,
                                align: "left",
                                valign: "bottom",
                                offsetx: 0,
                                offsety: 0
                            },
                            coordinate: {
                                width: "90%",
                                height: "90%",
                                background_color: null,
                                axis: {
                                    color: "#bfbfc3",
                                    width: ["1", "1", 2, "1"]
                                },
                                grid_color: "#c0c0c0",
                                label: {
                                    fontweight: 500,
                                    color: "#f5f5f5",
                                    fontsize: 0
                                }
                            },
                            label: {
                                fontweight: 200,
                                color: "black",
                                fontsize: 13
                            },
                            type: "pie2d",
                            data: data9
                        });
                        chart.draw();
                    });

                }else{
                    document.getElementById("MemberProject").innerHtml = "没有数据";
                }


                if( fnIsEmp( ret.data10 ) && ret.data10.length ){

                    var scaleData10 = 0;
                    var TotalNum10 = 0;
                    for (var i = 0; i < data10.length; i++) {
                        data10[i].names = data10[i].name;
                        data10[i].name = i+1;
                        TotalNum10 = TotalNum10 + parseInt(data10[i].value);
                        if (scaleData10 < parseInt(data10[i].value)) {
                            scaleData10 = data10[i].value;
                        }
                    }
                    scaleData10 = getscaleData(scaleData10);
                    if (TotalNum10 == 0 || isNaN(TotalNum10)) {
                        TotalNum10 = 1
                    }
                    else {
                        TotalNum10 = TotalNum10;
                    }

                    $(function () {
                        var chart = iChart.create({
                            render: "SupportType",
                            width: DataWidth,
                            height: 500,
                            background_color: "#fdfdfd",
                            gradient: false,
                            color_factor: 0.2,
                            border: {
                                color: "#3e1c3e",
                                width: 0
                            },
                            align: "center",
                            offsetx: 0,
                            offsety: -30,
                            sub_option: {
                                border: {
                                    color: "#666791",
                                    width: 1
                                },
                                label: {
                                    fontweight: 600,
                                    fontsize: 13,
                                    color: "#4572a7",
                                    sign: "square",
                                    sign_size: 10,
                                    border: {
                                        color: "#BCBCBC",
                                        width: 1
                                    },
                                    background_color: "rgba(244,244,244,0)"
                                },
                                listeners: {
                                    parseText: function (d, t) {
                                        var a = d.get('value');
                                        var b = (Math.round(a / TotalNum10 * 10000) / 100.00 + "%");
                                        return a; //+ "/\n" + b; //自定义label文本
                                    }
                                }
                            },
                            shadow: true,
                            shadow_color: "#666666",
                            shadow_blur: 5,
                            showpercent: false,
                            column_width: "60%",
                            bar_height: "60%",
                            radius: "60%",
                            title: {
                                text: "",
                                color: "#3e576f",
                                fontsize: 13,
                                font: "微软雅黑",
                                textAlign: "left",
                                height: 30,
                                offsetx: 0,
                                offsety: 0
                            },
                            subtitle: {
                                text: "",
                                color: "#3e576f",
                                fontsize: 13,
                                font: "微软雅黑",
                                textAlign: "left",
                                height: 24,
                                offsetx: 0,
                                offsety: 0
                            },
                            legend: {
                                enable: false,
                                sign: "round",
                                sign_size: 10,
                                legend_space: 10,
                                background_color: "#fefefe",
                                color: "#333333",
                                fontsize: 8,
                                border: {
                                    color: "#BCBCBC",
                                    width: 0
                                },
                                column: 9,
                                align: "left",
                                valign: "bottom",
                                offsetx: widt,
                                offsety: 0
                            },
                            footnote: {
                                text: "",
                                color: "#c0c0c0",
                                fontsize: 13,
                                font: "微软雅黑",
                                textAlign: "right",
                                height: 2,
                                offsetx: 0,
                                offsety: 0
                            },
                            coordinate: {
                                width: "90%",
                                height: "65%",
                                background_color: "rgba(246,246,246,0.1)",
                                axis: {
                                    color: "#666791",
                                    width: ["", "", 2, ""]
                                },
                                grid_color: "#c0c0c0",
                                scale: [{
                                    position: 'left',
                                    start_scale: 0,
                                    //// end_scale:100,
                                    scale_space: scaleData10,
                                    scale_size: 2,
                                    scale_color: '#9f9f9f',

                                    label: {
                                        fontweight: 100,
                                        color: "#3e576f",
                                        fontsize: 13
                                    },
                                    listeners: {
                                        parseText: function (t, x, y) {
                                            //console.log(t);
                                            return {text: Math.ceil(t)}
                                        }
                                    }
                                }]
                            },
                            label: {
                                fontweight: 300,
                                color: "black",
                                fontsize: 13,
                                font: "微软雅黑,Arial,sans-serif"
                            },
                            type: "column2d",
                            data: data10
                        });
                        for( var i = 0; i < data10.length; i++ ){
                            $api.append( $api.dom( '#SupportType_ul' ), '<li>'+( +i + 1 )+': '+data10[i].names+'</li>');
                        }
                        chart.draw();
                    });

                }else{
                    
                }
	        }else{
                api.toast({
                    global: true,
                    msg: fnLanguageSwitch( fnErrorJson( err.body.error.message ) )
                });
	        }
            });
}



function getscaleData(scaleData) {
    if (scaleData >= 0 && scaleData <= 10) {
        scaleData = 1;
    }
    if (scaleData > 10 && scaleData <= 100) {
        scaleData = 10;
    }
    if (scaleData > 100 && scaleData <= 500) {
        scaleData = 50;
    }
    if (scaleData > 500) {
        scaleData = 100;
    }
    return scaleData;
}
function createtabledata(line, list, name1, value1) {
    //Create table
    var table = document.createElement("table");
    table.setAttribute("class", "areatable");
    for (var i = 0; i <= line; i++) {
        //create tr
        console.log("d");
        console.log(line);
        var tr = document.createElement("tr");
        for (var j = 0; j < list; j++) {
            //create td
            var td = document.createElement("td");
            var text = null;
            if (i == 0) {
                tr.setAttribute("class", "areatr1");
                //Load title
                if (j == 0) {
                    text = document.createTextNode("Location");
                }
                else {
                    text = document.createTextNode("# of Customer");
                }
            }
            else {
                tr.setAttribute("class", "areatr2");
                //Load data
                if (j == 0) {
                    text = document.createTextNode(name1[i - 1]);
                }
                else {
                    text = document.createTextNode(value1[i - 1]);
                }
            }
            td.appendChild(text);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    document.getElementById("MemberRegion").appendChild(table);
}

/*--------------------年月日tab切换-------------------*/


