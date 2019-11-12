"use strict";

module.exports = {
    _BASE_HTTP: "http://127.0.0.1:3080",
    //公用设置value的方法  节点上增加data-value 属性绑定他所对应的双向绑定的值. 
    setValue(e, _this, _cb){
        if (e.currentTarget && e.currentTarget.dataset) {
            try {
                const _data = {};
                _data[e.currentTarget.dataset.value] = e.detail.value;
                _this.setData(_data, () => {
                    if (_cb && typeof _cb == "function") {
                        _cb();
                    }
                });
            } catch (e) {
                console.log("并没有找到绑定到节点的数据！");
            }
        }
    },
    $alert(msg){
        wx.showToast({
            title: msg,
            icon: "none"
        });
    },
    // 小程序 http请求封装
    $ajax(obj, cb){
        var that = this;
        if (typeof obj == 'object' && obj.url) {
            var _type = obj.type ? obj.type : "get",                //是否是get 请求  默认是get
                _loading = obj.loading ? obj.loading : '1',        //是否需要loading弹窗  默认是需要展示弹窗
                _login = obj.login ? obj.login : '1',              //是否需要登录   默认是需要登录否则跳转到登录页面
                _urlPrefix = obj.urlPrefix ? obj.urlPrefix : '1', //是否有域名前缀  默认是不需要域名前缀
                _showError = obj.mistake ? obj.mistake : '1',       //是否有报错信息  默认是有
                _cb = obj.cb ? obj.cb : 1,                          //是否有回调函数  默认是无
                _header,
                _url;
            if (obj.header) {
                _header = obj.header;
            }else {
                if (_type == 'get' || _type == 'GET'){
                    _header = {
                        'token': wx.getStorageSync('token'),
                        'uid': wx.getStorageSync('uid'),
                        'content-type': 'application/json'
                    };   //是否需要加上头部 session 默认是需要
                }else {
                    _header = {
                        'token': wx.getStorageSync('token'),
                        'uid': wx.getStorageSync('uid'),
                        "Content-Type": "application/x-www-form-urlencoded"
                    };   //是否需要加上头部 session 默认是需要
                }
            }
            if (_urlPrefix == 1) {
                _url = that._BASE_HTTP + obj.url;
            } else {
                _url = obj.url;
            }
            if (_loading == 1) {
                wx.showLoading({
                    title: "loading...",
                    icon: "loding",
                    mask: true
                });
            }
            var _data = obj.data ? obj.data : {};
            wx.request({
                url: _url,
                data: _data,
                method: _type,
                header: _header,
                success: function (res) {
                    wx.hideLoading();
                    if (res.data.code != 403) {
                        if (typeof cb == 'function') {
                            if (_showError == 1) {
                                if (res.data.code == 1) {
                                    cb(res.data);
                                } else {
                                    wx.showToast({
                                        title: res.data.message || '服务器出错啦！',
                                        icon: "none"
                                    });
                                }
                            } else {
                                cb(res.data);
                            }
                        }
                    } else {
                        if (_login == 1) {
                            if (res.data.message.indexOf('登录已过期') != -1) {
                                wx.showToast({
                                    title: res.data.message || res.data.message || '服务器出错啦！',
                                    icon: "none"
                                });
                                setTimeout(()=> {
                                    wx.redirectTo({
                                        url: "/pages/login/login"
                                    });
                                }, 2000);
                            }
                        } else {
                            if (_showError == 1) {
                                wx.showToast({
                                    title: res.data.message || '服务器出错啦！',
                                    icon: "none"
                                });
                            }

                        }

                    }

                },
                error: function (res) {
                    wx.hideLoading();
                    wx.showToast({
                        title: res.data.message || '服务器出错啦！',
                        icon: "none"
                    });
                }
            });
        }
    },
    listTimeSet(_data){
        var i = _data;
        if (new Date(i.start_time.replace(/-/g,  "/")).getTime() - new Date().getTime() > 0) {   //未开始
            i.time = (new Date(i.start_time.replace(/-/g,  "/")).getTime() - new Date().getTime()) / 1000;
            i.isStart = false;
            i.end = false;
        } else if (new Date(i.start_time.replace(/-/g,  "/")).getTime() - new Date().getTime() < 0 && new Date(i.end_time.replace(/-/g,  "/")).getTime() - new Date().getTime() > 0) { //正在进行中
            i.time = (new Date(i.end_time.replace(/-/g,  "/")).getTime() - new Date().getTime()) / 1000;
            i.isStart = true;
            i.end = false;
        } else if (new Date(i.end_time.replace(/-/g,  "/")).getTime() - new Date().getTime() < 0) {    //已结束
            i.isStart = true;
            i.end = true;
        }
        i.timeShow = this.timeCountDown(i.time);
        i.time = i.time - 1;
        i.mark = true;
        return i;
        
    },
    /**
     * 深拷贝
     */
    deepClone (obj) {

        if (Object.prototype.toString.call(obj).slice(8, -1) != 'object' && Object.prototype.toString.call(obj).slice(8, -1) != 'Array') {
            return obj;
        }

        var newObj = obj.constructor === Array ? [] : {}; //开辟一块新的内存空间

        for (var i in obj) {
            newObj [i] = this.deepClone(obj [i]); //通过递归实现深层的复制
        }

        return newObj;
    },
    Tools: {
        /**
         * 手机号码格式是否正确
         * @param mobile:string 手机号码 11位
         * @return true/false
         */
        isMobile: function (mobile) {
            if (mobile && mobile.length != 11) return false;
            var reg = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/;
            if (mobile == '' || !reg.test(mobile)) {
                return false;
            }
            return true;
        },
        /**
         * 身份证号码格式是否正确
         * @param cardNo:string 身份证号码
         * @return true/false
         */
        isIdCardNo: function (cardNo) {
            if (cardNo == '' || !/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i.test(cardNo)) {
                return false;
            }
            return true;
        },

        /**
         * 公用处理数据---格式化金额  保留2位小数 千分位逗号
         * @param {type} number
         * @param {type} decimals
         * @param {type} thousands_sep
         * @param {type} dec_point
         * @param {type} roundtag  舍入参数，默认 "round" 四舍五入 ,"ceil" 向上取,"floor"向下取,
         * @returns {unresolved}
         */
        priceFormat: function (number, decimals, thousands_sep, dec_point, roundtag) {
            /*
             * 参数说明：
             * number：要格式化的数字
             * decimals：保留几位小数
             * dec_point：小数点符号
             * thousands_sep：千分位符号
             * roundtag:舍入参数，默认 "round" 四舍五入 ,"ceil" 向上取,"floor"向下取,
             * */
            //if(!number) return 0.00*1;
            number = (number + '').replace(/[^0-9+-Ee.]/g, '');
            roundtag = roundtag || "round"; //"ceil","floor","round"
            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                s = '',
                toFixedFix = function (n, prec) {
                    var s = n.toString();
                    var sArr = s.split(".");
                    var m = 0;
                    try {
                        m += sArr[1].length;
                    } catch (e) {
                    }

                    if (prec > m) {
                        return s;
                        /*'' + Number(s.replace(".", "")) / Math.pow(10, m);*/
                    } else {
                        sArr[1] = Math[roundtag](Number(sArr[1]) / Math.pow(10, m - prec));
                        while (sArr[1].toString().length < prec) {
                            sArr[1] = '0' + sArr[1];
                        }
                        return sArr.join('.');
                    }
                };
            s = (prec ? toFixedFix(n, prec) : '' + Math.floor(n)).split('.');
            var re = /(-?\d+)(\d{3})/;
            while (re.test(s[0])) {
                s[0] = s[0].replace(re, "$1" + sep + "$2");
            }

            if ((s[1] || '').length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1).join('0');
            }
            return s.join(dec);
        }
    },


    /**
     * 提示信息
     */
    Messager: {
        /**
         * 成功的提示
         */
        success: function (_msg) {
            wx.showToast({
                title: _msg,
                icon: "success"
            });
        },
        /**
         * 错误的提示
         */
        error: function (_msg) {
            wx.showToast({
                title: _msg,
                icon: "none"
            });
        },
        /**
         * 加载中
         */
        loading: function () {
            wx.showLoading({
                title: "loading...",
                icon: "loding",
                mask: true
            });
        },
        /**
         * 去掉加载中的提示
         */
        hideLoading: function () {
            wx.hideLoading();
        }
    },

    /**
     * 获取网络数据
     * @param _config:object {url:"",type:"get/post",data:{},callback:function(){}}
     */
    loadJson(_config) {
        var _inThis = this;
        //加入loding


        this.Messager.loading();


        wx.getStorage({
            key: 'sid',
            success: function (sid) {
                wx.request({
                    url: _inThis._BASE_HTTP + _config.url,
                    data: _config.data,
                    header: {
                        Authorization: sid.data
                    },
                    method: _config.type,
                    success: function (response) {
                        _inThis.Messager.hideLoading();
                        if (typeof _config.callback == "function") {
                            _config.callback(response.data);
                        }
                    },
                    fail: function () {
                        _inThis.Messager.hideLoading();
                        wx.showToast({
                            title: "接口请求失败",
                            icon: "none"
                        });
                    }
                });
            }
        })

    },

    uploadFile(_config){
        var _url = _config.url;
        var _filePath = _config.filePath;
        var _inThis = this;
        this.Messager.loading();
        wx.getStorage({
            key: 'sid',
            success: function (res) {
                wx.uploadFile({
                    url: _inThis._BASE_HTTP + _url, //仅为示例，非真实的接口地址
                    filePath: _filePath,
                    header: {
                        Authorization: res.data
                    },
                    name: 'file',
                    success: function (response) {
                        _inThis.Messager.hideLoading();
                        if (typeof _config.callback == "function") {

                            _config.callback(JSON.parse(response.data));
                        }
                    },
                    fail: function () {
                        _inThis.Messager.hideLoading();
                        wx.showToast({
                            title: "接口请求失败",
                            icon: "none"
                        });
                    }
                })
            }
        })
    },


    //获取图片
    getImg(_config){
        var _inThis = this;

        this.Messager.loading();


        wx.getStorage({
            key: 'sid',
            success: function (sid) {
                wx.request({
                    url: _inThis._BASE_HTTP + "/api/file/image/" + _config.fid,
                    method: 'GET',
                    header: {
                        Authorization: sid.data
                    },
                    responseType: 'arraybuffer',
                    success: res => {
                        _inThis.Messager.hideLoading();
                        let base64 = wx.arrayBufferToBase64(res.data);
                        base64 = 'data:image/jpg;base64,' + base64;
                        if (typeof _config.callback == "function") {
                            _config.callback(base64);
                        }
                    }

                });
            }
        })
    },
    /**
     * 倒计时
     */
    timeCountDown(_time){
        var theTime = parseInt(_time),// 秒
            theTime1 = 0,              // 分
            theTime2 = 0,               // 小时
            theTime3 = 0;                // 天
        if (theTime > 60) {
            theTime1 = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if (theTime1 > 60) {
                theTime2 = parseInt(theTime1 / 60);
                theTime1 = parseInt(theTime1 % 60);
                if (theTime2 > 24) {
                    theTime3 = parseInt(theTime2 / 24);
                    theTime2 = parseInt(theTime2 % 24);
                }
            }
        }
        _time--;
        return theTime3 + "天" + theTime2 + "小时" + theTime1 + "分" + theTime + "秒";

    },
    // 格式化时间 返回 年月日的格式
    forMatterDate(_date){
        var date = new Date(_date);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate();
        
        return (Y + M + D);
    },
    // 格式化时间 返回 年月日时分秒
    forMatterMinute(_date){
        var date = new Date(_date);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate();
        var H = date.getHours() + ':';
        var Mi = date.getMinutes();
        return (Y + M + D + H + Mi);
    },
    // 格式化时间 返回 年月日的格式
    returnNow(){
        var date = new Date();
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + '-';
        var H = date.getHours() + ':';
        var Mi = date.getMinutes();
        return (Y + M + D + H + Mi);
    }
    
};
