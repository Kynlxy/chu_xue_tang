// pages/mapsDetail/mapsDetail.js
"use strict";
"use strict";
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rstLongitude: "", //地图主视角的经纬度
    retLatitude: "",
    markers: [],
    circles: [],
    detail: ""  //详细地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.mapCtx = wx.createMapContext('map');
    this.markPlace(options);
  },
  /**
   *  标记圆心以及 定位
   * @param options
   */
  markPlace(options) {
    this.setData({
      detail: options.detail
    });
    var _ajax = new Promise(resolve => {
      wx.request({
        url: "https://apis.map.qq.com/ws/geocoder/v1/?address=" + options.detail + ',' + "&key=" + util._MAP_KEY,
        type: "get",
        success(res){
          if (res.statusCode == 200){
            resolve(res.data);

          }
        }
      });
    });
    _ajax.then( res => {
      var rstLongitude = res.result.location.lng,
          retLatitude = res.result.location.lat;
      this.setData({
        rstLongitude: rstLongitude,
        retLatitude: retLatitude
      });
      var _obj = {},
          obj = {},
          _arr = [],
          arr = [];
      _obj.id = 1;
      _obj.longitude = rstLongitude;
      _obj.latitude = retLatitude;
      _obj.width = 25;
      _obj.height = 40;
      _obj.iconPath = "/images/others.png";
      arr.push(_obj);

      obj.latitude = retLatitude;
      obj.longitude = rstLongitude;
      obj.radius = 500;
      obj.color = "#eff8f966";
      obj.fillColor = "#a5dbe266";
      obj.strokeWidth = 1;
      _arr.push(obj);

      var data = {};
      data.markers = arr;
      data.circles = _arr;
      this.setData(data);
    });
  },
  /**
   * 打开地图
   */
  goPlace() {
    wx.openLocation({
      //​使用微信内置地图查看位置。
      latitude: this.data.retLatitude * 1,//要去的纬度-地址
      longitude: this.data.rstLongitude * 1,//要去的经度-地址
      name: this.data.detail,
      address: this.data.detail
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