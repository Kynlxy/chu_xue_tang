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
            {text: "交易成功", img: "../../images/auction.png", url: "/pages/commonList/commonList?type=3"},
            {text: "我的收藏", img: "../../images/start.png", url: "/pages/commonList/commonList?type=4"}
        ],
        menuArr: [
            {text: "银行卡",img: "../../images/bank-card.png", url: "/pages/bankCard/bankCard"},
            {text: "实名认证", img: "../../images/true-info.png", url: "/pages/certification/certification"},
            {text: "收货地址", img: "../../images/address.png", url: "/pages/receivingAddress/receivingAddress"},
            {text: "买受人订单", img: "../../images/order-1.png", url: "/pages/order/order?type=1"},
            {text: "出售人订单", img: "../../images/order-2.png", url: "/pages/order/order?type=2"},
            {text: "资金明细", img: "../../images/money.png", url: "/pages/myDeposit/myDeposit"},
            {text: "帮助中心", img: "../../images/note.png", url: "/pages/helpCenter/helpCenter"}
        ],
        hidden: true,
        myInfo: {

        },
        moneyInfo:{

        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    getMyInfo() {
        util.$ajax({
            url: "/?act=getUserByToken",
            data: {
                token: wx.getStorageSync('token')
            },
            loading: 2
        }, res => {
            if (res.code == 1) {
                wx.setStorage({//存储到本地
                    key: "myInfo",
                    data: JSON.stringify(res.data)
                });
                this.setData({
                    myInfo: res.data
                });
            }
        });
        util.$ajax({
            url: "/?act=getMyAccount",
            loading: 2
        }, res => {
            if(res.code == 1){
                this.setData({
                    moneyInfo: res.data
                });
            }
        });
    },
    /**
     *
     */
    confirm() {
        util.$ajax({
            url: "/?act=logout",
            mistake: 2
        }, res => {
            this.setData({
                hidden: true
            });
            wx.showToast({
                title: res.msg,
                icon: "none"
            });
            if (res.code == 1) {
                wx.setStorage({//存储到本地
                    key: "myInfo",
                    data: '{}'
                });
                setTimeout(()=> {
                    wx.redirectTo({
                        url: "/pages/loginView/loginView"
                    });
                }, 2000);
            } else {

            }
        });
    },
    /**
     * 退出
     */
    layout() {
        var that = this ;
        wx.showModal({
            title: '退出登录',
            content: '是否要退出登录',
            success: function (tip) {
                if (tip.confirm) {
                    that.confirm();
                }else {

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