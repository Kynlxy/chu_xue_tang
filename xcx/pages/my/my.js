// pages/my/my.js
"use strict";
const app = getApp();
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        myProductArr: [
            {text: "购买记录", img: "../../images/my-auction.png", url: "/pages/commonList/commonList?type=1"},
            {text: "我的商品", img: "../../images/my-product.png", url: "/pages/commonList/commonList?type=2"},
            {text: "我的收藏", img: "../../images/start.png", url: "/pages/commonList/commonList?type=4"}
        ],
        menuArr: [
            {text: "帮助中心", img: "../../images/note.png", url: "/pages/helpCenter/helpCenter"}
        ],
        hidden: true,
        myInfo: {},
        moneyInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 获取本人信息
     */
    getMyInfo() {
        util.$ajax({
            url: "/api/app/class/getUserInfo",
            data: {
                token: wx.getStorageSync('token')
            },
            type: 'post',
            loading: 2
        }, res => {
            if (res.code == 1) {
                if (res.data && res.data.create_time) {
                    res.data.create_time = util.forMatterDate(res.data.create_time);
                }
                wx.setStorage({//存储到本地
                    key: "myInfo",
                    data: JSON.stringify(res.data)
                });
                this.setData({
                    myInfo: res.data
                });
            }
        });
    },
    /**
     *
     */
    confirm() {
        wx.showToast({
            title: '退出成功',
            icon: "none"
        });
        wx.setStorage({//存储到本地
            key: "token",
            data: ''
        });
        setTimeout(() => {
            wx.redirectTo({
                url: "/pages/login/login"
            });
        }, 1000);
    },
    /**
     * 退出
     */
    layout() {
        var that = this;
        wx.showModal({
            title: '退出登录',
            content: '是否要退出登录',
            success: function (tip) {
                if (tip.confirm) {
                    that.confirm();
                } else {

                }

            }

        });

    },
    cancel() {
        this.setData({
            hidden: true
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getMyInfo();

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
});