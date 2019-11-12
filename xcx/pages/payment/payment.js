// pages/payment/payment.js
"use strict";
const app = getApp();
const util = require('../../utils/util.js');

var template = require('../template/bottom/template.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myInfo: {},
    goods_bond: 0.00,
    isClick: false,
    goods_id: null  //id存放处
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    this.setData({
      goods_bond: options.goods_bond,
      goods_id: options.goods_id
    }, () => {
      this.getMyMoney(options.goods_bond);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  getMyMoney(_money) {
    util.$ajax({
      url: "/?act=getMyAccount",
      data: {
        token: wx.getStorageSync('token')
      }
    }, res => {
      if (res.code == 1) {
        var _data = {}, isClick;
        _data.myInfo = res.data;
        if (_money * 1 > res.data.total_amount * 1){
          isClick = false;
        }else {
          isClick = true;
        }
        _data.isClick = isClick;
        this.setData(_data)
      }
    });
  },
  /**
   * 缴纳保证金
   */
  submit() {
    var {isClick , goods_id} = this.data;
    if (isClick == false) {
      util.$alert("余额不足,无法缴纳保证金!");
      return false
    }
    util.$ajax({
      url: "/?act=addGoodBond" ,
      data: {
        goods_id: goods_id
      }
    } , res => {
      if (res.code == 1) {
        util.$alert("缴纳成功!");
        setTimeout( () => {
          wx.navigateBack({
            delta: 1
          })
        },1000);
      }
    });
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