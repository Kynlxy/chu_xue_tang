// pages/offlinePayment/offlinePayment.js
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        interim: [],          //图片临时存放处
        goods_img: []       //图片id

    },
    /**
     * 拍照
     */
    takePhoto(e) {
        var that = this, {goods_img, interim} = this.data, arr = [];
        if (goods_img.length == 8) {
            util.$alert("超出上传图片的最大数量!");
            return false;
        }
        wx.chooseImage({
            success(res) {

                var tempFilesSize = res.tempFiles[0].size;  //获取图片的大小，单位B

                if (tempFilesSize >= 20000000) {
                    util.$alert("上传图片不能大于20M");
                    return false;
                }

                //图片展示, 临时存放处, 展示的同时再往后台上传, 避免性能体验上的问题.
                that.setData({
                    interim: [...interim, res.tempFilePaths[0]]
                });
                wx.uploadFile({
                    url: util._BASE_HTTP + '/?act=addGoodPic',
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    header: {
                        'token': wx.getStorageSync('token'),
                        'content-type': 'multipart/form-data'
                    },
                    //同时进行上传操作.
                    success(res) {
                        if (res.statusCode == 200) {
                            var _res = JSON.parse(res.data),
                                _obj = {};

                            if (_res.code == 1) {
                                _obj.fid = _res.data.fid;
                                _obj.url = util._BASE_HTTP + '/?act=getImg&type=fpath&fid=' + _res.data.fid;
                                arr.push(_obj);
                            } else {
                                _obj.fid = null;
                                _obj.url = null;
                                arr.push(_obj);
                            }
                            that.setData({
                                goods_img: [...goods_img, ...arr]
                            });
                        }

                    }
                });


            }
        })
    },
    submit() {
        var {goods_img} = this.data;
        if (goods_img.length == 0) {
            util.$alert("请上传打款凭证");
            return;
        }
        var _arr = [];
        goods_img.map(i => {
            _arr.push(i.fid);
        });
        var _data = {
            order_id: this.data.order_id,
            pay_type: 1,
            delivery_mode: this.data.delivery_mode,
            pay_pic: _arr.toString()
        };
        if (this.data.delivery_mode == 1) {
            _data.addr_id = this.data.address.addr_id
        }
        util.$ajax({
            url: "/?act=payOrder",
            data: _data
        }, res => {
           if (res.code == 1) {
               util.$alert("提交成功,已交给后台审核");
               wx.setStorageSync('order-detail' , '{}');
               setTimeout(() => {
                   wx.switchTab({
                       url: "/pages/my/my"
                   }); 
               },1000);
               
               return;
           }
        });

    },
    /**
     * 图片删除
     */
    deleteImg(e) {
        var {goods_img, interim} = this.data,
            _index = e.currentTarget.dataset.index;
        goods_img.splice(_index, 1);
        interim.splice(_index, 1);
        var _data = {};
        _data.goods_img = goods_img;
        _data.interim = interim;
        this.setData(_data);


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _data = JSON.parse(wx.getStorageSync('order-detail'));
        this.setData(_data)
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