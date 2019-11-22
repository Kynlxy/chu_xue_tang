//index.js
//获取应用实例
"use strict";
const app = getApp();
const util = require('../../utils/util.js');
Page({
    data: {
        mainData: [],
        bannerList: []
    },
    onLoad () {
        this.getBanner();
        this.getClassList();

    },
    onShow(){

    },
    onHide(){

    },
    onReady(){

    },
    /**
     * 获取课程
     */
    getClassList() {
        util.$ajax({
            url: '/api/class/getClass'
        }, res => {
            if (res.data && res.data.length > 0) {
                res.data.map (i => {
                   i.fid = util._BASE_HTTP + '/api/pic/getImg?id=' + i.fid;
                   i.create_time = util.forMatterDate(i.create_time);
                });
                this.setData({
                    mainData: res.data
                });
            }
        });
    },
    /**
     * 获取banner图
     */
    getBanner(){
        util.$ajax({
            url: '/api/class/getBanner',
            data: {
                status: 1
            }
        }, res => {
            if (res.data && res.data.length > 0) {
                var _arr = [];
                res.data.map(i => {
                    _arr.push(util._BASE_HTTP + '/api/pic/getImg?id=' + i.fid);
                });
            }
            this.setData({
                bannerList: _arr
            });
        });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.hideNavigationBarLoading();//隐藏导航条加载动画。
        wx.stopPullDownRefresh();//停止当前页面下拉刷新。
    }
});
