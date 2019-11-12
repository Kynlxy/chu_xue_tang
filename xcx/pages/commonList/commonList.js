// pages/commonList/commonList.js
"use strict";
const util = require('../../utils/util.js');
var template = require('../template/bottom/template.js');
var clearTime = [];
var product = require('../template/product/product.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: null,    // 表示哪个列表
        page: 1,
        limit:10,
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
        if(options.id) {
            _data.id = options.id;
        }
        this.setData(_data , () => {
            this.setTitle(options.type);
            this.getList();
        });


    },
    /**
     * 获取数据列表
     */
    getList(){
        let {page ,limit , isAjax ,mainData , isEnd , type , id} = this.data,
            that = this,
            _url ;
        switch (type) {
            case '1':
                _url = "/?act=myBondGoods"; break;
            case  '2':
                _url = "/?act=myGoods"; break;
            case '3':
                _url = '/?act=mySuccessGoods'; break;
            case  '4':
                _url = "/?act=getFavorite" ; break;
            case '100':
                _url = "/?act=goodList&cate_id=" + id ; break;
            default: return;
        }
        // 如可以下拉刷新 那么就执行下拉刷新
        if (isAjax == true){
            //开始下拉刷新的时候 关闭开关 避免 疯狂请求接口
            this.setData({
                isAjax: false
            });
            util.$ajax({
                url: _url,
                data:{
                    page: page,
                    limit: limit,
                    area_id: wx.getStorageSync('area_id')
                }
            },res =>{
                //请求结束  表示可以继续请求接口了
                this.setData({
                    isAjax: true
                });
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
     * 动态设定 页面的title
     */
    setTitle(_type) {
        this.setData({
            type: _type
        }, () => {
            var _title;
            switch (_type) {
                case '1':
                    _title = '购买记录'; break;
                case  '2':
                    _title = '我的商品'; break;

                case '3':
                    _title = '交易成功'; break;
                case  '4':
                    _title = '我的收藏'; break;
                case  '100':
                    _title = '产品列表'; break;
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