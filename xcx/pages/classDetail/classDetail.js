// pages/auctionDetails/auctionDetails.js
"use strict";
const app = getApp();
const util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        class_id: null,
        imgUrls: [],
        classInfo: {},
        teacherInfo: {},
        path: null
    },
    onLoad(options) {
        if (options && options.class_id)
        this.setData({
            class_id: options.class_id ? options.class_id : null
        }, () => {
            this.getClassDetail();
        });
    },
    /**
     * 获取课程的详情       获取授课老师的详情
     */
    getClassDetail() {
        const { class_id } = this.data;
        util.$ajax({
            url: '/api/app/class/getClassDetail',
            data: {
                class_id: class_id
            }
        }, res => {
            let _arr = [];
            _arr.push(util._BASE_HTTP + '/api/pic/getImg?id=' + res.data.fid);
            this.setData({
                imgUrls: _arr,
                classInfo: res.data,
              path: `${util._BASE_HTTP}/api/video/play?fid=${res.data.video_id}`
            });
        });
        util.$ajax({
            url: '/api/app/class/getClassTeacherDetail',
            data: {
                class_id: class_id
            }
        }, res => {
            this.setData({
                teacherInfo: res.data
            });
        });
    },
    /**
     * 拨打号码
     */
    callPhone(e) {
        var _phone = e.currentTarget.dataset.phone;
        wx.makePhoneCall({
            phoneNumber: _phone
        });
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        var that = this ;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
    }
});