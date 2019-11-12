// pages/goodsPublish/goodsPublish.js

"use strict";
const app = getApp();
const util = require('../../utils/util.js');
var clearTime = [];
var product = require('../template/product/product.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1 ,
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

  },
  /**
   * 页面进来执行的方法
   */
  getAllAjax(){
    this.getList();
    // this.getMyInfo();
  },
  /**
   * 获取个人信息
   */
  getMyInfo() {
    if (wx.getStorageSync('myInfo')) {

    }else {
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
        }
      });
    }
  },
  /**
   * 跳转到发布页面
   */
  toPublish() {
    var _token = JSON.parse(wx.getStorageSync('myInfo'));
    if (_token.real_status == 1){
      wx.navigateTo({
        url: "/pages/newDetails/newDetails"
      })
    }else {
      wx.showModal({
        title: '实名认证',
        content: '请先完成实名认证再进行发布商品',
        success: function (tip) {
          if (tip.confirm) {
            wx.navigateTo({
              url: "/pages/certification/certification"
            })
          }else {

          }

        }

      });
    }
  },
  /**
   * 获取数据列表
   */
  getList(){
    let {page ,limit , isAjax ,mainData , isEnd} = this.data,
        that = this;
    // 如可以下拉刷新 那么就执行下拉刷新
    if (isAjax == true){
      //开始下拉刷新的时候 关闭开关 避免 疯狂请求接口
      this.setData({
        isAjax: false
      });
      util.$ajax({
        url:"/?act=goodList",
        data:{
          page: page,
          limit: limit,
          area_id: wx.getStorageSync('area_id')
        },
        loading: 2
      },res =>{
        //请求结束  表示可以继续请求接口了
        this.setData({
          isAjax: true
        });
        app.isGetList = true;
        app.area_id_one = wx.getStorageSync('area_id');
        if(res.code == 1){
          if ( res.data.info.length > 0) {
            res.data.info.map(i => {
              if (i.mark) {

              }else {
                //公用的时间处理
                i = util.listTimeSet(i);
              }

            });
          }
          this.setData({
            mainData: [...mainData,...res.data.info],
            total:res.data.page.total,
            page: page + 1
          }, ()=> {

            //将定时器清除

            if (clearTime.length > 0 ){
              clearTime.map(i => {
                clearInterval(i);
              });
              clearTime = [];
            }
            var a = setInterval(() => {
              product.cutDown(that)
            }, 1000);
            clearTime.push(a);
          });
          if(res.data.page.total  <= (page - 1) * limit){
            // 说明数据已经加载完了不可以再继续下拉刷新了
            this.setData({
              isAjax: false
            });
          }
        }else{
          wx.showToast({
            title: res.message,
            icon: "none"
          });
        }
      });
    }else{
      //保证只加载一次弹窗
      if (isEnd == false){
        wx.showToast({
          title: '已加载所有数据!',
          icon: "none"
        });
        this.setData({
          isEnd:true
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
    //表明他切换了城市  需要重新获取数据  否则没切换城市那就不重新调取接口了
    if (app.area_id_one == wx.getStorageSync('area_id') && app.isGetList == true) {

    }else {
      var _data = {};
      _data.page = 1;
      _data.limit = 10;
      _data.isAjax = true;  //是否可以去下拉
      _data.isEnd = false;  //是否加载完了
      _data.total = 0;
      _data.mainData = "";
      this.setData(_data, () => {
        this.getList();
      });
    }
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
    if (clearTime.length > 0) {
      clearTime.map(i => {
        clearInterval(i);
      });
      clearTime = [];
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var _data = {};
    _data.page = 1;
    _data.limit = 10;
    _data.isAjax = true;  //是否可以去下拉
    _data.isEnd = false;  //是否加载完了
    _data.total = 0;
    _data.mainData = "";
    this.setData(_data, () => {
      this.getList();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList();
    wx.hideNavigationBarLoading();//隐藏导航条加载动画。
    wx.stopPullDownRefresh();//停止当前页面下拉刷新。
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});