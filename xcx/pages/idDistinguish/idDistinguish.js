// pages/idDistinguish/idDistinguish.js
"use strict";
const app = getApp();

const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgBgOne: "",
    imgBgTwo: "",
    imgBgOneSave:"",
    imgBgtWOSave:"",
    trueName: "",   //真实姓名
    idCard: "" ,    //身份证号码
    typeArr:[{name: '个人账号'},{name: '集体账号'}],
    typeIndex: 0,
    cname: ""   //集体名称
  },
  /**
   * 自动绑定输入框
   */
  valueInput(e){
    util.setValue(e, this);
  },
  /**
   * 拍照
   */
  takePhoto(e) {
    var that = this;
    wx.chooseImage({
      success(res) {
        if (e.currentTarget.dataset.index == 1) {
          that.setData({
            imgBgOne: res.tempFilePaths[0]
          });
        } else if (e.currentTarget.dataset.index == 2) {
          that.setData({
            imgBgTwo: res.tempFilePaths[0]
          });
        }
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            var _url = res.data;
            if (e.currentTarget.dataset.index == 1) {
              that.setData({
                imgBgOneSave: _url
              });
              that.checkoutOcr();

            } else if (e.currentTarget  .dataset.index == 2) {
              that.setData({
                imgBgTwoSave: _url
              });
              that.checkoutOcr();

            }
          }
        });

      }
    })
  },
  /**
   * 提交
   */
  submitInfo() {
    var  {imgBgOne, imgBgTwo,trueName , idCard , typeIndex , cname} = this.data ,
        that = this;
    app.Test.addTestRule({
      name: 'isHaving',
      val: imgBgOne,
      errMsg: "未上传身份证正面照!"
    }).addTestRule({
      name: 'isHaving',
      val: imgBgTwo,
      errMsg: "未上传身份证反面照!"
    }).addTestRule({
      name: 'isHaving',
      val: trueName,
      errMsg: "并没有识别出姓名!"
    }).addTestRule({
      name: 'isHaving',
      val: idCard,
      errMsg: "并没有识别出身份证!"
    });
    if ( typeIndex ==  1) {
      app.Test.addTestRule({
        name: 'isHaving',
        val: cname,
        errMsg: "请输入集体名称!"
      });
    }
    if (app.Test.checkRule()) {
      wx.showModal({
        title: '提交实名认证',
        content: '是否提交？一经确认,不可修改!',
        success: function (tip) {
          if (tip.confirm) {
            that.confirm();
          }else {

          }

        }

      });
    }
  },

  /**
   * 实名认证
   */
  confirm() {
    var {trueName , idCard , typeIndex , cname} = this.data,
        _data = {};
    _data.token = wx.getStorageSync('token');
    _data.true_name = trueName;
    _data.card_id = idCard;
    if (typeIndex == 0) {
      _data.custom_type = typeIndex + 1
    } else {
      _data.custom_type = 2;
      _data.cname = cname;
    }
    util.$ajax({
      url: "/?act=updateName",
      data: _data
    } ,res => {
      if (res.code == 1){
        util.$alert("认证成功!");
        setTimeout(()=> {
          wx.switchTab({
            url: "/pages/my/my"
          });
        }, 2000);
      }


    });
  },
  /**
   * ocr识别
   */
  checkoutOcr(){
    var _data = this.data;
    if (_data.imgBgOne != '' && _data.imgBgTwo != '') {
      this.ocrSubmit();
    }
  },
  /**
   * 选择分类
   */
  valueCommonInput(e){
    var _val = e.detail.value;
    this.setData({
      typeIndex: _val
    })
  },
  /**
   * 进行ocr识别
   */
  ocrSubmit(){
    var _data = this.data,
        that = this,
        _header = {
          'Cookie': 'sid=' + wx.getStorageSync('sid'),
          'cid': '953',
          'secret': 'a528f9c57193e92e',
          'content-type': 'application/json'
        };
    //提交正面身份证

    util.$ajax({
        url: util._YUN_HTTP + "/risk/data/idCardDistinguish/query",
        type: "post",
        data: {
          idCardSide: 'front',
          imgType: 'jpg',
          imgBase64: _data.imgBgOneSave
        },
        header: _header,
        urlPrefix: 2,
        mistake: 2
      }, res => {
        if (res.data && res.data.resultData && res.data.resultData.idcard) {
          util.$alert("识别成功!");

          that.setData({
            orcAjax: true,
            trueName: res.data.resultData.trueName,
            idCard: res.data.resultData.idcard
          });
        } else {
          this.setData({
            trueName: "",
            idCard: ""
          });
          util.$alert("识别出错了!请检查身份证正面是否正确!");
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