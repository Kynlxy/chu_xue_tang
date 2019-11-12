// pages/cityChoose/cityChoose.js
"use strict";
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    place: '暂未获取地址..',
    placeArr:[],
    provinceId: {}, //省
    cityId: {},     //市
    regionId: {},   //区
    areaId: {},      //镇
    
    provinceArr: [], //省数据存放的地区
    cityArr: [],    //市存放数据的地区
    regionArr: [],  //区存放数据的地区
    areaArr:[],     //镇存放数据的地区
    mark: 1         //1表示省, 2表示市 , 3表示区 , 4表示镇
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.splitCity(options);
    this.getCity();
  },
  splitCity(options){
    if (options.place){
      let _arr = options.place.split(','),
          _place = "";
      _arr.map( (i,index) => {
        if (index == _arr.length - 1) {
          _place = _place + i
        }else {
          _place = _place + i + '/'
        }

      });
      this.setData({
        place: _place
      })
    }

  },
  /**
   * 切换状态
   */
  chooseType(e) {
    var {provinceId, cityId, regionId , areaId} = this.data;
    var _index = e.target.dataset.index;
    if (_index == 1 && provinceId.value) {
      this.setData({
        mark: _index
      })
    }
    if (_index == 2 && cityId.value) {
      this.setData({
        mark: _index
      })
    }
    if (_index == 3 && regionId.value) {
      this.setData({
        mark: _index
      })
    }
    if (_index == 4 && areaId.value) {
      this.setData({
        mark: _index
      })
    }
  },
  /**
   * 选择城市
   */
  choosePlace(e) {
    var { mark , provinceArr , cityArr , regionArr , areaArr} = this.data;
    var _item = e.target.dataset.detail,
        _arr = [],
        _key = '',
        _obj = {},
        _data = {};
    if (mark == 1){
      _arr = provinceArr;
      _key = 'provinceArr';
      _data.provinceId = _item;
      _data.cityArr = _item.children;
      _data.cityId = {};
      _data.regionId = {};
      _data.areaId = {};
      _data.regionArr = [];
      _data.areaArr = [];
      this.setData(_data);

    } else if (mark == 2){
      _arr = cityArr;
      _key = 'cityArr';
      _data.cityId = _item;
      _data.regionArr = _item.children;
      _data.regionId = {};
      _data.areaId = {};
      _data.areaArr = [];
      this.setData(_data);

    }else if (mark == 3){
      _arr = regionArr;
      _key = 'regionArr';
      _data.regionId = _item;
      _data.areaArr = _item.children;
      _data.areaId = {};
      this.setData(_data);

    }else {
      _arr = areaArr;
      _key = 'areaArr';
      _data.areaId = _item;
      this.setData({areaId: _item});
    }
    if (mark < 4) {
      mark ++
    }
    _arr.map(i => {
      if (i.key == _item.key){
        i.active = 1;
      }else {
        i.active = 2;
      }
    });
    _obj[_key] = _arr;
    this.setData(_obj, ()=> {
      setTimeout(() => {
        this.setData({mark: mark})
      },100);
    });




  },
  /**
   * 获取城市
   */
  getCity () {
    util.$ajax({
      url: "/index.php?act=areas"
    },res => {
      if (res.code == 1){
        this.setData({
          placeArr: util.deepClone(res.data),
          provinceArr: util.deepClone(res.data)
        });
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