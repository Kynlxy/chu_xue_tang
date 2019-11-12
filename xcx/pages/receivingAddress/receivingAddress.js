// pages/receivingAddress/receivingAddress.js
"use strict";
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      mainData:[],
      type: null
  },

  chooseAddress(e) {
    if (!this.data.type) {
      return;
    }
    getApp().address = e.target.dataset.value;
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 2) {
      this.setData({
        type: 2
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 删除
   */
  deleteId(e) {
    var _id = e.target.dataset.id;
    util.$ajax({
      url: "/?act=delAddr",
      data: {
        addr_id: _id
      }
    }, res => {
      if (res.code == 1) {
        util.$alert("删除成功");
        this.getAllAddress();
      }
    });
  },
  //获取所有的地址
  getAllAddress() {
    util.$ajax({
      url: "/?act=addrList",
      loading: 2
    }, res => {
        this.setData({
          mainData: res.data
        });
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAllAddress();
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