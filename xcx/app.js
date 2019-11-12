"use strict";
const util = require('utils/util.js');
const formValidation = require('utils/formValidation.js');

App({
    onLaunch: function () {

    },
    /**
     * 判断是否登方法
     */
    checkLogin(){
        var that = this;
        wx.request({
            url: util._BASE_HTTP + "/api/wns/checklogin",
            method: 'get',
            header: that.globalData.header, //请求时带上这个请求头
            success: function (res) {
                if (res.data.code == 1) {

                } else {
                    wx.showToast({
                        title: '检测到未登录,请先登录!',
                        icon: "none"
                    });
                    setTimeout(() => {
                        wx.redirectTo({
                            url: "/pages/login/index"
                        });
                    }, 2000);
                }

            }
        })
    },
    //获取用户地理位置权限
    getPermission: function (obj, _cb) {
        var that = this;
        wx.getLocation({
            type: 'wgs84',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
            success: function (res) {
                res.latitude = res.latitude.toFixed(6);
                res.longitude = res.longitude.toFixed(6);
                wx.setStorage({//存储到本地
                    key: "latitude",
                    data: res.latitude
                });
                wx.setStorage({//存储到本地
                    key: "longitude",
                    data: res.longitude
                });
                obj.setData({
                    rstLongitude: res.longitude,
                    retLatitude: res.latitude
                }, () => {
                    if (_cb && typeof _cb == 'function') {
                        _cb();
                    }
                });
            },
            fail: function () {
                wx.getSetting({
                    success: function (res) {
                        var statu = res.authSetting;
                        if (!statu['scope.userLocation']) {
                            wx.showModal({
                                title: '是否授权当前位置',
                                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                                success: function (tip) {
                                    if (tip.confirm) {
                                        wx.openSetting({
                                            success: function (data) {
                                                if (data.authSetting["scope.userLocation"] === true) {
                                                    wx.showToast({
                                                        title: '授权成功',
                                                        icon: 'success',
                                                        duration: 1000
                                                    });
                                                    //授权成功之后，再调用chooseLocation选择地方
                                                    wx.getLocation({
                                                        type: 'wgs84',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
                                                        success: function (res) {
                                                            res.latitude = res.latitude.toFixed(6);
                                                            res.longitude = res.longitude.toFixed(6);
                                                            wx.setStorage({//存储到本地
                                                                key: "latitude",
                                                                data: res.latitude
                                                            });
                                                            wx.setStorage({//存储到本地
                                                                key: "longitude",
                                                                data: res.longitude
                                                            });
                                                            obj.setData({
                                                                rstLongitude: res.longitude,
                                                                retLatitude: res.latitude
                                                            }, () => {
                                                                if (_cb && typeof _cb == 'function') {
                                                                    _cb();
                                                                }
                                                            });
                                                        }
                                                    })
                                                } else {
                                                    that.getPermission();
                                                }
                                            }
                                        })
                                    }else {
                                        that.getPermission();

                                    }

                                },
                                error(){
                                    that.getPermission();
                                }
                            })
                        }
                    },
                    fail: function (res) {
                        wx.showToast({
                            title: '调用授权窗口失败',
                            icon: 'success',
                            duration: 1000
                        })
                    }
                })
            }
        })
    },
    globalData: {
        header: {'Cookie': 'sid=' + wx.getStorageSync('sid'), 'content-type': 'application/json'}

    },
    Test: new formValidation.default(),
    area_id_one: null,     
    area_id_two: null,
    isGetList: false,        //第二个导航页的发布的数据维护
    isGetMsg: false,         //第三页导航页的资讯发布的维护处
    address: {}              //地区获取地址
});