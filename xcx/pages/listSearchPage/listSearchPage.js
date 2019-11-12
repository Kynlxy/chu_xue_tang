// pages/listSearchPage/listSearchPage.js
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
        sortIndex: 0,           //默认排序
        sortArr: [
            {id: 0, value: '默认排序'},
            {id: 1, value: '开始时间升序'},
            {id: 2, value: '开始时间降序'},
            {id: 3, value: '结束时间升序'},
            {id: 4, value: '结束时间降序'}],
        sortTypeArr: [{id: 0, value: "默认类型"}],
        sortTypeIndex: 0,
        type: null,    // 表示哪个列表
        page: 1,
        limit: 10,
        isAjax: true,  //是否可以去下拉
        isEnd: false,  //是否加载完了
        total: 0,
        mainData: '',
        goods_name: ""  //搜索框绑定的数值

    },
    valueInput(e){
        util.setValue(e, this);
    },
    /**
     * 通用value值设定
     */
    selectValueInput(e){
        var _key = e.currentTarget.dataset.value,
            _val = e.detail.value,
            _obj = {};
        _obj.mainData = "";
        _obj.total = 0;
        _obj.page = 1;
        _obj.isAjax = true;
        _obj.isEnd = false;
        _obj.goods_name = "";
        if (_key == 'sortIndex') {
            _obj.sortIndex = _val;
        } else {
            _obj.sortTypeIndex = _val
        }
        this.setData(_obj, () => {
            this.getList();
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
    },
    /**
     * 获取分类类型
     */
    getType() {
        let {sortTypeArr} = this.data;
        util.$ajax({
            url: "/?act=getCate"
        }, res => {
            if (res.code == 1) {
                this.setData({
                    cateArr: res.data
                }, () => {
                    var _data = res.data;
                    _data.map(i => {
                        var _obj = {};
                        _obj.value = i.cate_name;
                        _obj.id = i.id;
                        sortTypeArr.push(_obj);
                    });
                    this.setData({
                        sortTypeArr: sortTypeArr
                    })
                });
            }
        });
    },
    /**
     * 获取列表数据
     */
    getList() {
        var {page, limit, isAjax, mainData, isEnd, goods_name, sortIndex, sortTypeIndex, sortTypeArr, mainData} = this.data,
            that = this,
            _url = "/?act=goodList",
            _data = {
                page: page,
                limit: limit,
                area_id: wx.getStorageSync('area_id')
            };
        if (sortIndex == 0) {
        } else if (sortIndex == 1) {
            _data.start_time = 'asc';
        } else if (sortIndex == 2) {
            _data.start_time = 'desc';
        } else if (sortIndex == 3) {
            _data.end_time = 'asc';
        } else if (sortIndex == 4) {
            _data.end_time = 'desc';
        }
        if (sortTypeIndex != 0) {
            _data.cate_id = sortTypeArr[sortTypeIndex].id;
        }
        if (goods_name) {
            _data.goods_name = goods_name;
        }

        // 如可以下拉刷新 那么就执行下拉刷新
        if (isAjax == true) {
            //开始下拉刷新的时候 关闭开关 避免 疯狂请求接口
            this.setData({
                isAjax: false
            });
            util.$ajax({
                url: _url,
                data: _data
            }, res => {
                //请求结束  表示可以继续请求接口了
                this.setData({
                    isAjax: true
                });
                if (res.code == 1) {
                    if (res.data.info.length > 0) {
                        res.data.info.map(i => {
                            if (i.mark) {

                            } else {
                                //公用的时间处理
                                i = util.listTimeSet(i);
                            }

                        });
                    } else {

                    }
                    this.setData({
                        mainData: [...mainData, ...res.data.info],
                        total: res.data.page.total,
                        page: page + 1
                    }, ()=> {
                        //将定时器清除
                        if (clearTime.length > 0) {
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
                    if (res.data.page.total <= (page - 1) * limit) {
                        // 说明数据已经加载完了不可以再继续下拉刷新了
                        this.setData({
                            isAjax: false
                        });
                    }
                } else {
                    wx.showToast({
                        title: res.message,
                        icon: "none"
                    });
                }
            });
        } else {
            //保证只加载一次弹窗
            if (isEnd == false) {
                wx.showToast({
                    title: '已加载所有数据!',
                    icon: "none"
                });
                this.setData({
                    isEnd: true
                });
            }
        }
    },

    /**
     * 倒计时函数
     */
    cutDown() {
        let {mainData} = this.data;
        mainData.map(i => {
            i.timeShow = util.timeCountDown(i.time);
            i.time = i.time - 1
        });
        this.setData({
            mainData: mainData
        }, ()=> {
            setTimeout(() => {
                this.cutDown();
            }, 1000)
        })

    },
    productSearch() {
        var _obj = {};
        _obj.mainData = "";
        _obj.total = 0;
        _obj.page = 1;
        _obj.isAjax = true;
        _obj.isEnd = false;
        this.setData(_obj, ()=> {
            this.getList();
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
        this.getType();// 获取分类类型
        this.getList();

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