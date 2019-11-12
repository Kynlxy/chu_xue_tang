// pages/bankCard/bankCard.js
"use strict";
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankInfo: {},
    hasBank: false,
    num: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBank();
  },
  /**
   * 获取银行卡
   */
  getBank() {
    util.$ajax({
      url: "/?app=user&act=getMyBank"
    }, res => {
      if (res.data && res.data.bank_name) {
        var _num = res.data.bank_account.substring(res.data.bank_account.length - 4);
        var _obj = {
          hasBank: true,
          bankInfo: res.data,
          num: _num
        };
        this.setData(_obj);
      } else {
        var _obj = {
          hasBank: false,
          bankInfo: {},
          num: ""
        };
        this.setData(_obj);
      }
    });
  },
  /**
   * 解绑银行卡
   */
  relieve: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确定要解绑银行卡吗',
      showCancel: true,
      confirmText: '解绑',
      success: function (res) {
        if (res.confirm) {
          util.$ajax({
            url: "/?act=delBank&app=user"
          }, res => {
            if (res.code == 1) {
              setTimeout(() => {
                util.$alert("解绑成功!");
              },0);
              that.getBank();
            }
          });
        }

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