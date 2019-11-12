// pages/myDeposit/myDeposit.js
"use strict";
const app = getApp();
const util = require('../../utils/util.js');

var template = require('../template/bottom/template.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    limit: 10,
    isAjax: true,  //是否可以去下拉
    isEnd: false,  //是否加载完了
    total: 0,
    mainData: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  /**
   * 获取数据
   */
  getList() {

    let {page, limit, isAjax, mainData, isEnd} = this.data;
    // 如可以下拉刷新 那么就执行下拉刷新
    if (isAjax == true) {
      //开始下拉刷新的时候 关闭开关 避免 疯狂请求接口
      this.setData({
        isAjax: false
      });
      util.$ajax({
        url: '/?act=getUserAccount',
        data: {
          page: page,
          limit: limit
        }
      }, res => {
        //请求结束  表示可以继续请求接口了
        this.setData({
          isAjax: true
        });
        if (res.code == 1) {
          this.setData({
            mainData: [...mainData, ...res.data.info],
            total: res.data.page.total,
            page: page + 1
          });
          if (res.data.page.total <= (page - 1) * limit) {
            // 说明数据已经加载完了不可以再继续下拉刷新了
            this.setData({
              isAjax: false
            });
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: "none"
          });
        }
      });
    } else {
      //保证只加载一次弹窗
      if (isEnd == false) {
        wx.showToast({
          title: '已加载所有数据!',
          icon: "none"
        });
        this.setData({
          isEnd: true
        });
      }
    }
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
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});