// pages/certification/certification.js
"use strict";
const app = getApp();
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    real_status:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo();
  },
  /**
   * 获取个人详情
   */
  getInfo() {
    util.$ajax({
      url: "/?act=getUserByToken",
      loading: 2
    },res => {
      if (res.code == 1){
        this.setData({
          info: res.data,
          real_status: res.data.real_status
        });
      }
    });

  },
  /**
   * 拍照
   */
  takePhoto() {
    var that = this;
    wx.chooseImage({
      success(res) {
        var tempFilesSize = res.tempFiles[0].size;  //获取图片的大小，单位B

        if(tempFilesSize >= 2000000) {
          util.$alert("上传头像不能大于2M");
          return false;
        } console.log(res.tempFilePaths);
        wx.uploadFile({
          url: util._BASE_HTTP + '/?act=updateAvatar',
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: {
            'token': wx.getStorageSync('token'),
            'content-type': 'multipart/form-data'
          },
          success(res) {
            var _data = JSON.parse(res.data);
            if (_data.code == 1){
              util.$alert("头像上传成功!");
              that.getInfo();

            }else {
              util.$alert(_data.msg || "上传失败!");
            }
          }
        });
      }
    })
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