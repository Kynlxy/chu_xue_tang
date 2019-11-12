// pages/addBankDiv/addBankDiv.js
"use strict";
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinceArr: [],
    provinceIndex: 0,
    cityArr: [],
    cityIndex: 0,
    bankArr: [],
    bankIndex: 0,
    branch: "",
    bank_name: "",
    bank_account: ""
  },
  commonChoose(e) {
    var _index = e.detail.value,
        _key = e.target.dataset.value,
        _obj = {};
    _obj[_key] = _index;
    if (_key == 'provinceIndex') {
      _obj['cityArr'] = this.data.provinceArr[_index].child;
      _obj['cityShow'] = true;
    }
    this.setData(_obj);


  },
  valueInput(e){
    util.setValue(e, this);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllAjax();
  },
  /**
   * 获取省份  获取银行卡列表
   */
  getAllAjax: function () {
    util.$ajax({
      url: "/?act=getBankArea&app=user",
      type: "get"
    }, res => {
      this.setData({
        provinceArr: res.data,
        cityArr: res.data[0].child
      });
    });
    util.$ajax({
      url: "/?act=getBankCode&app=user",
      type: "get"
    }, res => {
      this.setData({
        bankArr: res.data
      });
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 绑定银行卡
   */
  addBank: function () {
    var {branch,
        // bank_name,
        bank_account , provinceArr, provinceIndex , cityArr , cityIndex,  bankArr , bankIndex} = this.data;
    if (bank_account.length == 0) {
      util.$alert("请输入银行卡号");
      return
    }
    if (branch.length == 0) {
      util.$alert("请输入分行信息");
      return;
    }
    // if (bank_name.length == 0) {
    //   util.$alert("请输入银行名称");
    //   return;
    // }
    var _data = {
      bank_account: bank_account,
      branch: branch,
      // bank_name: bank_name,
      province: provinceArr[provinceIndex].name,
      city: cityArr[cityIndex].name,
      bank_code: bankArr[bankIndex].code
    };
    util.$ajax({
      url: "/?act=addBank&app=user",
      data: _data
    }, res => {
      util.$alert("绑定成功");
      setTimeout(() => {
        wx.redirectTo({
          url: "/pages/bankCard/bankCard"
        });
      },1000);
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