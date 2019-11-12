// pages/order/order.js
const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseIndex:0 ,
    type: null,    // 表示哪个列表
    page: 1,
    limit:10,
    pay_status: null,
    isAjax: true,  //是否可以去下拉
    isEnd: false,  //是否加载完了
    total: 0,
    mainData: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _data = {};
    _data.type = options.type;
    this.setData(_data , () => {
      this.setTitle(options.type);
      this.getList();
    });
  },
  /**
   * 选择订单类型
   */
  chooseType(e) {
    var _index = e.currentTarget.dataset.index;
    this.setData({
      chooseIndex: _index,
      pay_status: _index,
      page: 1,
      limit:10,
      isAjax: true,  //是否可以去下拉
      total: 0,
      isEnd: false,  //是否加载完了
      mainData: ''
    } , () => {
      this.getList()
    })

  },
  /**
   * 确认收货
   */
  confirmReceipt(e){
    var _item = e.target.dataset.item,
        that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认收货?',
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
         util.$ajax({
           url: "/?act=confirmReceipt",
           data: {
             order_id: _item.order_id
           }
         }, res => {
           util.$alert("操作成功");
           setTimeout( () => {
             that.setData({
               page: 1,
               limit:10,
               isAjax: true,  //是否可以去下拉
               total: 0,
               isEnd: false,  //是否加载完了
               mainData: ''
             } , () => {
               that.getList()
             })
           },1000);
         });
        }
      }
    });
  },
  /**
   * 获取数据列表
   */
  getList(){
    let {page ,limit , isAjax ,mainData , isEnd , type , pay_status } = this.data,
        that = this,
        _url ;
    switch (type) {
      case '1':
        _url = "/?act=myOrder"; break;
      case  '2':
        _url = "/?act=ownerOrder"; break;
      default: return;
    }
    // 如可以下拉刷新 那么就执行下拉刷新
    if (isAjax == true){
      //开始下拉刷新的时候 关闭开关 避免 疯狂请求接口
      this.setData({
        isAjax: false
      });
      var _data = {
        page: page,
        limit: limit
      };
      if (pay_status) {
        _data.pay_status = pay_status;
      }
      util.$ajax({
        url: _url,
        data: _data
      },res =>{
        //请求结束  表示可以继续请求接口了
        this.setData({
          isAjax: true
        });
        if(res.code == 1){
          this.setData({
            mainData: [...mainData,...res.data.info],
            total:res.data.page.total,
            page: page + 1
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
  setTitle(_type) {
    this.setData({
      type: _type
    }, () => {
      var _title;
      switch (_type) {
        case '1':
          _title = '买受人订单'; break;
        case  '2':
          _title = '出售人订单'; break;
        default: return;
      }
      wx.setNavigationBarTitle({
        title: _title
      })
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
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})