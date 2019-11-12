// pages/paymentPage/paymentPage.js
const app = getApp();
const util = require('../../utils/util.js');
var utilMd5 = require('../../utils/md5.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mainData: {},
        order_id: "",
        address: {},
        delivery_mode: "",
        now: "",
        chooseType: 2

    },
    chooseWx() {
        this.setData({
            chooseType: 2
        });
    },
    chooseDown() {
        this.setData({
            chooseType: 1
        });
    },
    /**
     * 支付
     */
    payFnc() {
        var pay_pic = this.data.chooseType,
            { delivery_mode , order_id} = this.data;
        // 微信支付
        if (pay_pic == 2) {
            var _data = {
                pay_type: 2,
                order_id: order_id,
                delivery_mode: delivery_mode
            };
            if (delivery_mode == 1) {
                _data.addr_id = this.data.address.addr_id
            }
            util.$ajax({
                url: "/?act=payOrder",
                data: _data
            }, res => {
                var _timeStamp = new Date().getTime().toString(),
                    _nonceStr = res.data.nonce_str,
                    _package = 'prepay_id=' + res.data.prepay_id;
                var _paySign = utilMd5.hexMD5('appId=' + res.data.appid + '&nonceStr=' + _nonceStr
                    + '&package=' + _package + '&signType=MD5&timeStamp=' + _timeStamp + '&key=' + util._PAY_KEY);
                wx.requestPayment(
                    {
                        'timeStamp': _timeStamp,
                        'nonceStr': _nonceStr,
                        'package': _package,
                        'signType': 'MD5',
                        'paySign': _paySign,
                        success: function (res) {
                            util.$alert("支付成功");
                            wx.setStorageSync('order-detail' , '{}');
                            setTimeout(() => {
                                wx.switchTab({
                                    url: "/pages/my/my"
                                });
                            },1000);
                        },
                        fail: function (res) {
                            util.$alert("支付失败,请稍后再试!");

                        },
                        complete: function (res) {


                        }
                    });
            });
        //    线下支付
        } else {
            wx.navigateTo({
                url: "/pages/offlinePayment/offlinePayment"
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
        var _data = JSON.parse(wx.getStorageSync('order-detail'));
        this.getDetail(_data);

    },
    getDetail(_data) {
        var _id = _data.order_id;
        util.$ajax({
            url: "/?act=showOrder",
            data: {
                order_id: _id
            }
        }, res => {
            var _obj = {
                now: util.returnNow(),
                mainData: res.data,
                address: _data.address,
                order_id: _data.order_id,
                delivery_mode: _data.delivery_mode
            };
            this.setData(_obj);
        });

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