// pages/information/information.js
"use strict";
const app = getApp();
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    limit: 10,
    mark: false,
    total: null,
    isEnd: false,
    mainData:[],
    area_id: wx.getStorageSync('area_id')

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
    //表明他切换了城市  需要重新获取数据  否则没切换城市那就不重新调取接口了
    if (app.area_id_two == wx.getStorageSync('area_id') && app.isGetMsg == true) {
      
    }else {
      var _data = {};
      _data.page = 1;
      _data.limit = 10;
      _data.mark = false;
      _data.total = null;
      _data.isEnd = false;
      _data.mainData = [];
      _data.area_id = wx.getStorageSync('area_id');
      this.setData(_data, ()=> {
        this.getList();
      });
    }

  },
  /**
   * 获取列表
   */
  getList(){
    let {page , limit , mainData ,isEnd ,area_id } = this.data,
        _data = {};
    if (isEnd == true) {
      return false;
    }
    _data.page = page;
    _data.limit = limit;
    if (area_id) {
      _data.area_id = area_id;
    }
    util.$ajax({
      url: "/?act=newList",
      data: _data,
      loading: 2
    },res => {
      if (res.code == 1){
        var _data = {};
        _data.mainData = [...mainData, ...res.data.info];
        _data.total = res.data.page.total;
        if (res.data.page.page * res.data.page.limit * 1 >= res.data.page.total * 1){
          _data.isEnd = true;
        }

        //表示 已经发起了请求
        app.area_id_two = wx.getStorageSync('area_id');
        app.isGetMsg = true;
        this.setData(_data);
      }
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
    var _data = {};
    _data.page = 1;
    _data.limit = 10;
    _data.mark = false;
    _data.total = null;
    _data.isEnd = false;
    _data.mainData = [];
    _data.area_id = wx.getStorageSync('area_id');
    this.setData(_data, ()=> {
      this.getList();
    });
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