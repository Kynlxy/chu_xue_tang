// pages/loginView/loginView.js
"use strict";
const app = getApp();

const util = require('../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        mobile: "",         //手机号
        pwd: "",                            //密码
    },
    valueInput(e){
        util.setValue(e, this);
    },
    /**
     * 登录
     */
    login() {
        let { mobile , pwd } = this.data;
        app.Test.addTestRule({
            name: 'isMobile',
            val: mobile,
            errMsg: "请输入正确的手机号码!"
        }).addTestRule({
            name: 'isHaving',
            val: pwd,
            errMsg: "请输入密码!"
        });
        if (app.Test.checkRule()) {
            util.$ajax({
                url: '/api/user/login',
                data: {
                    mobile: mobile,
                    pwd: pwd,
                },
                type: 'post'
            },res => {
                if (+ res.code === 1){
                    wx.setStorageSync('token', res.token);
                    wx.setStorageSync('uid', res.info.uid);
                    util.$alert('登录成功！');
                    setTimeout(() => {
                        wx.switchTab({
                            url: '/pages/index/index'
                        });
                    },1000);
                }
            });
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
})