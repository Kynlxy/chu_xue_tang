// pages/informationDetails/informationDetails.js
"use strict";
const util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      detailInfo: {

      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    this.getDetail(options);
  },
  getDetail(options){
    var that = this;
    util.$ajax({
      url: "/api/class/getNewsDetail",
      type: "get",
      data: {
        id: options.id
      }
    },res => {
      if (res.code == 1){
        var article = res.data.content;
        res.data.create_time = util.forMatterDate(res.data.create_time);
        WxParse.wxParse('content', 'html', article , that, 5);
        this.setData({
          detailInfo: res.data
        }, ()=> {
          this.getTime(options);
        });
      }
    });
  },
  getTime(options){
      util.$ajax({
          url: '/api/class/addWatchTimes',
          data: {
              id: options.id
          }
      }, res => {

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
  onShareAppMessage: function (res) {
    var that = this ;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '初学堂',
      path: '/pages/index/index?page=/pages/informationDetails/informationDetails&nid=' + that.data.nid,
      success: function(res) {

      },
      fail: function(res) {

      }
    }
  }
})