// pages/recharge/recharge.js

"use strict";
const app = getApp();
const util = require('../../utils/util.js');
var utilMd5 = require('../../utils/md5.js');

var template = require('../template/bottom/template.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  valueInput(e){
    util.setValue(e, this);
  },
  /**
   * 充值
   */
  submit() {
    if (this.data.money.length == 0) {
      util.$alert("请输入充值金额!");
      return false;
    }
    if (this.data.money.length > 9  || Number(this.data.money) < 0.01) {
      util.$alert("请输入正确的金额!");
      return false;
    }
    util.$ajax({
      url: "/?act=webRegester&amount=" + this.data.money,
      loading: 2
    }, res => {
      if (res.code == 1) {
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
                util.$alert("充值成功!");
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000);
              },
              fail: function (res) {
                util.$alert("支付失败,请稍后再试!");

              },
              complete: function (res) {


              }
            });
      }
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