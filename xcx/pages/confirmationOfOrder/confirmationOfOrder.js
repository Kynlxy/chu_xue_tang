// pages/confirmationOfOrder/confirmationOfOrder.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order_id: "",
        checkRadio: null,
        mainData: {},
        place: {},
        items: []
    },
    /**
     * 获取更多地址
     */
    morePlace() {
        wx.navigateTo({
            url: "/pages/receivingAddress/receivingAddress?type=2"
        });
    },
    radioChange(e) {
        var _val = e.currentTarget.dataset.index;
        this.setData({
            checkRadio: _val
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            order_id: options.id
        }, () => {
            this.productDetail();
        });
    },
    /**
     * 获取产品详情
     */
    productDetail() {
        util.$ajax({
            url: "/?act=showOrder",
            data: {
                order_id: this.data.order_id
            }
        }, res => {
            var _arr = [];
            if (res.data.delivery_mode.length > 0) {
                res.data.delivery_mode.map(i => {
                    var _obj = {};
                    if (i == 1) {
                        _obj.value = 1;
                        _obj.name = '邮寄';
                        _obj.checked = false;
                    } else if (i == 2) {
                        _obj.value = 2;
                        _obj.name = '自提';
                        _obj.checked = false;
                    } else {
                        _obj.value = 4;
                        _obj.name = '其他';
                        _obj.checked = false;
                    }
                    _arr.push(_obj);
                })
            }
            var _data = {
                mainData: res.data,
                items: _arr,
                place: res.data.addr
            };
            this.setData(_data)
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
        if (getApp().address && getApp().address.address) {
            this.setData({
                place: getApp().address
            });
        }
    },
    submit() {
        var {checkRadio, place } = this.data,
            _data = this.data;
        if (!checkRadio) {
            util.$alert("请选择提取方式");
            return;
        }
        if (checkRadio == 1 && !place.address) {
            util.$alert("未选择收货地址");
            return;
        }
        var _obj = {
            address: _data.place,
            order_id: _data.order_id,
            delivery_mode: _data.checkRadio
        };
        wx.setStorage({ //存储到本地
            key: "order-detail",
            data: JSON.stringify(_obj)
        });
        wx.navigateTo({
            url: "/pages/paymentPage/paymentPage"
        })
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