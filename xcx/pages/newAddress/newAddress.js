// pages/newAddress/newAddress.js
"use strict";
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    mobile: "",
    address: ""
  },
  valueInput(e){
    util.setValue(e, this);
  },
  submit() {
    var {name , mobile , address}  = this.data;
    if (name.length == 0) {
      util.$alert("请输入姓名");
      return;
    }
    if (mobile.length == 0) {
      util.$alert("请输入手机号");
      return;
    }
    if (address.length == 0) {
      util.$alert("请输入详细收货地址");
      return;
    }
    util.$ajax({
      url: "/?act=saveAddr",
      data: {
        status: 1,
        name: name,
        mobile: mobile,
        address: address,
        token: wx.getStorageSync('token')
      }
    }, res => {
      if (res.code == 1) {
        util.$alert("添加成功");
        setTimeout(() => {
          wx.navigateBack();
        },2000);

      }
    });
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