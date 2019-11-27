// pages/information/information.js
"use strict";
const app = getApp();
const util = require('../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        total: null,
        isEnd: false,
        mainData: [],

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

        var _data = {};
        _data.page = 1;
        _data.total = null;
        _data.isEnd = false;
        _data.mainData = [];
        this.setData(_data, () => {
            this.getList();
        });

    },
    /**
     * 获取列表
     */
    getList(){
        let {page, mainData, isEnd, area_id} = this.data,
            _data = {};
        if (isEnd == true) {
            return false;
        }
        _data.page = page;
        _data.status = 1;
        _data.type = 1;
        util.$ajax({
            url: "/api/class/getNewsList",
            data: _data,
            loading: 2
        }, res => {
            if (res.code == 1) {
                var _data = {};
                if (res.data && res.data.length > 0) {
                    res.data.map(i => {
                        i.fid = util._BASE_HTTP + '/api/pic/getImg?id=' + i.fid;
                        i.create_time = util.forMatterDate(i.create_time);
                    });
                }
                _data.mainData = [...mainData, ...res.data];
                _data.total = res.total;
                if (page * 10 >= res.data.total * 1) {
                    _data.isEnd = true;
                }
                //表示 已经发起了请求
                this.setData(_data);
            }
        });
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
        var _data = {};
        _data.page = 1;
        _data.total = null;
        _data.isEnd = false;
        _data.mainData = [];
        this.setData(_data, () => {
            this.getList();
        });
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