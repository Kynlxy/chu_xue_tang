// pages/cashWithdrawal/cashWithdrawal.js
"use strict";
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasBank: {},
    bankInfo: {},
    moneyInfo: {},
    money: "",
    click: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllAjax();
  },
  /**
   * 获取银行卡信息
   */
  getAllAjax() {
    util.$ajax({
      url: "/?app=user&act=getMyBank",
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
        wx.showModal({
          title: '提示',
          content: '检测到您未绑定银行卡,请先绑定银行卡再提现',
          showCancel: true,
          confirmText: '前往绑定',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: "/pages/addBankDiv/addBankDiv"
              });
            }
          }
        });
      }
    });
    util.$ajax({
      url: "/?act=getMyAccount",
      loading: 2
    }, res => {
      if (res.code == 1) {
        this.setData({
          moneyInfo: res.data
        });
      }
    });
  },
  valueInput(e) {
    this.setData({
      money: e.detail.value
    }, () => {
      if (e.detail.value.length == 0 ||  e.detail.value * 1 > this.data.moneyInfo.total_amount ) {
        this.setData({
          click: false
        });
      } else {
        this.setData({
          click: true
        });
      }
    });

  },
  /**
   * 申请提现
   */
  getMoney() {
    util.$ajax({
      url: "/?act=withdraw&app=user",
      data: {
        money: this.data.money
      }
    }, res => {
      util.$alert("申请成功");
      setTimeout(() => {
        wx.redirectTo({
          url: "/pages/extractDetail/extractDetail?money=" + this.data.money
        });
      },1000);
    });
        
  },
  /**
   * 申请所有金额
   */
  getAllMoney() {
    this.setData({
      money: this.data.moneyInfo.total_amount,
      click: true
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