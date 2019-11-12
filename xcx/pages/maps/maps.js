// pages/maps/maps.js
"use strict";
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    circles:[],                //圆心
    rstLongitude: "", //地图主视角的经纬度
    retLatitude: "",
    hidden: true,
    place: "暂无选择地区"
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
    this.mapCtx = wx.createMapContext('map');
    this.getPlace();
  },
  /**
   * 执行确定操作
   */
  confirm() {
    let {markers} = this.data;
    wx.showToast({
      title: markers[0].longitude + ',' +  markers[0].latitude,
      icon: "none"
    });
    this.setData({
      hidden: true
    });
  },
  cancel() {
    this.setData({
      hidden: true
    });

  },
  getPlace() {
    var that = this ;
    //获取当前地点
    if (wx.getStorageSync('longitude') && wx.getStorageSync('latitude')) {
      this.setData({
        rstLongitude: wx.getStorageSync('longitude'),
        retLatitude: wx.getStorageSync('latitude')
      });
    } else {
      wx.getLocation({
        type: 'wgs84',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
        success: function (res) {
          wx.setStorage({//存储到本地
            key: "latitude",
            data: res.latitude
          });
          wx.setStorage({//存储到本地
            key: "longitude",
            data: res.longitude
          });
          that.setData({
            rstLongitude: res.longitude,
            retLatitude: res.latitude
          });
        }
      });
    }
  },
  /**
   * 获取地点
   */
  selectPlace(){
    let {markers} = this.data,
        that = this ,
        _data = {};
    if (markers.length > 0) {
      that.setData({
        hidden: false
      });

    }else {
      wx.showToast({
        title: "暂未选择地点",
        icon: "none"
      });
    }
  },
  returnPlace(e){
    var arr = [],
        _arr = [],
        obj = {},
        _obj = {},
        that = this ;
    this.mapCtx.getCenterLocation({
      success(res) {
        var _data = {};
        _data.makers = arr;
        _obj.id = 1;
        _obj.longitude = res.longitude;
        _obj.latitude = res.latitude;
        _obj.width = 25;
        _obj.height = 40;
        _obj.iconPath = "/images/others.png";
        arr.push(_obj);

        obj.latitude = res.latitude;
        obj.longitude = res.longitude;
        obj.radius = 1000;
        obj.color = "#eff8f966";
        obj.fillColor = "#a5dbe266";
        obj.strokeWidth = 1;
        _arr.push(obj);
        var data = {};
        data.circles = _arr;
        data.markers = arr;
        that.setData(data);
        //获取详细地址

        wx.request({
          url: "https://apis.map.qq.com/ws/geocoder/v1/?location=" + _arr[0].latitude + ','
          + _arr[0].longitude + "&key=" + util._MAP_KEY,
          type: "get",
          success(res){
            if (res.data.result.address_component) {
              _data.place = res.data.result.address;
              that.setData(_data);

            }
          }
        });
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