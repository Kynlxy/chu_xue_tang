// pages/newDetails/newDetails.js
"use strict";
const app = getApp();
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeData: "" ,       //城市查询input 值存放处
        setArr:[],              //设置过的城市
        isShow: false,
        goods_name: "",     //产品标题名
        start_time: "",
        hourArr: [{name:'0:00'},{name:'1:00'},{name:'2:00'},{name:'3:00'},{name:'4:00'},
            {name:'5:00'},{name:'6:00'},{name:'7:00'},{name:'8:00'},{name:'9:00'},{name:'10:00'},
            {name:'11:00'},{name:'12:00'},{name:'13:00'},{name:'14:00'},{name:'15:00'},{name:'16:00'},
            {name:'17:00'},{name:'18:00'},{name:'19:00'},{name:'20:00'},{name:'21:00'},{name:'22:00'},{name:'23:00'},{name:'24:00'}],
        hourIndex1: 0,
        end_time: "",
        hourIndex2: 0,
        goods_price: "",    //起拍价
        goods_bond: "",     //保证金
        goods_add: "",      //加价幅度
        markers: [],
        circles: [],                //圆心
        rstLongitude: "", //地图主视角的经纬度
        retLatitude: "",
        interim: [],          //图片临时存放处
        goods_img: [],       //图片id
        hidden: true,
        place: "暂无选择地区",    //地区存放处
        area_id: "",            //详情地id存放处
        chooseData:{},          //详情地对象
        overHidden: false,
        customer_name: "", //经纪人
        customer_phone: "",  //经纪人电话
        cateArr: [],    //接口返回的所有商品存放处
        cateIndex: 0,  //选的是第几个商品类型
        cateObj: [],   //商品类型选择完了之后的 商品存放处
        isAjax: false,   //提交开关, 避免多次提交
        ruleArr: [],     //手续费规则
        yd: false,          //邮递
        zt: false,          //自提
        qt: false,           //其他
        qtMsg:"人工配送"            //其他的内容
    },
    /**
     * 最后提交
     */
    submit() {
        let {
            isAjax,
            goods_name, start_time, hourIndex1 ,end_time, hourIndex2 ,
            goods_add, goods_price, goods_bond ,area_id ,place ,hourArr,
            goods_img, cateObj , goods_content  , cateArr , cateIndex,
            yd, zt , qt , qtMsg} = this.data;
        if (!yd && !zt && !qt) {
            util.$alert("请选择提货方式");
            return ;
        }
        if (qt && qtMsg.length == 0 ) {
            util.$alert("请输入其他提货方式的内容");
            return;
        }
        if (isAjax == true) {  //避免函数抖动 多次提交
            return false;
        }
        app.Test.addTestRule({
            name: 'isHaving',
            val: goods_name,
            errMsg: "请先输入商品名称!"
        }).addTestRule({
            name: 'minLength',
            val: goods_img.length,
            length:1 ,
            errMsg: "请上传照片!"
        }).addTestRule({
            name: 'isHaving',
            val: start_time,
            errMsg: "请输入开始时间!"
        }).addTestRule({
            name: 'isHaving',
            val: end_time,
            errMsg: "请输入结束时间!"
        }).addTestRule({
            name: 'isHaving',
            val: goods_price,
            errMsg: "请输入起拍价格!"
        }).addTestRule({
            name: 'isHaving',
            val: goods_bond,
            errMsg: "请输入保保证金!"
        }).addTestRule({
            name: 'isHaving',
            val: goods_add,
            errMsg: "请输入加价幅度!"
        }).addTestRule({
            name: 'isHaving',
            val: area_id,
            errMsg: "请选择产品所在地!"
        });
        if (app.Test.checkRule()) {
            var _obj = {};

            _obj.goods_name = goods_name; //产品标题名称
            var _arr = [];
            goods_img.map(i => {
                _arr.push(i.fid);
            });
            _obj.goods_img = _arr.toString() ;   //产品图片
            _obj.start_time = start_time + ' ' + hourArr[hourIndex1].name ; //产品开始时间

            _obj.end_time = end_time + ' ' +  hourArr[hourIndex2].name;     //产品结束时间
            _obj.goods_price = goods_price; //产品的起拍价格
            _obj.goods_bond = goods_bond; //产品的保证金
            _obj.goods_add = goods_add;  //产品的加价幅度
            _obj.cateDesc = [];  //产品的分类属性

            cateObj.map(i => {
                if (i.keys && i.val ) {
                    var _str = i.keys + ',' + i.val ;
                    if (i.val) {
                        _str = _str + ',' + i.unit;
                    }
                    _obj.cateDesc.push(_str);
                }

            });
            _obj.cateDesc = encodeURIComponent(JSON.stringify(_obj.cateDesc));
            _obj.cate_id = cateArr[cateIndex].id; //产品属性的分了id
            _obj.goods_address = place;     //产品的详细地址
            _obj.area_id = area_id;       //产品的城市的id
            _obj.goods_content = goods_content || "";//产品的备注
            
            //提货方式-----------------------
            var _arrs = [];
            if (yd) {
                _arrs.push(1);
            }
            if (zt) {
                _arrs.push(2);
            }
            if (qt) {
                _arrs.push(4);
                _obj.delivery_type = qtMsg;
            }
            _obj.delivery_mode = _arrs;

            //提货方式结束-------------------
            this.setData({
                isAjax: true
            });
            util.$ajax({
                url: "/?act=addGood",
                data: _obj,
                mistake: 2,
                type: "post"
            }, res => {
                if (res.code == 1) {
                    util.$alert("添加成功,请联系后台管理员尽快审核!");
                    setTimeout( () => {
                        wx.redirectTo({
                            url: "/pages/commonList/commonList?type=2"
                        });
                    },2000);
                }else {
                    this.setData({
                        isAjax: false
                    });
                    util.$alert(res.msg || "提交失败");
                }
            });

        }
    },
    //获取设置过的城市
    getSetPlace() {
        util.$ajax({
            url: "/index.php?act=areas",
            loading: 2
        }, res => {
            if (res.code == 1){
                this.setData({
                    setArr: res.data
                });
            }
        });
    },
    /**
     * 地区搜索
     */
    citySearch() {
        var {placeData} = this.data,
            that = this,
            _data = {};
        if (placeData.length == 0){
            util.$alert("未查询到该地址!");
            return false;
        }
        wx.request({
            url: "https://apis.map.qq.com/ws/geocoder/v1/?address=" + placeData + "&key=" + util._MAP_KEY,
            type: "get",
            success(res){
                if(res.data.status == 347){
                    util.$alert("查询无结果");
                    return false;
                }
                if (res.data.result && res.data.result.location){
                    _data.rstLongitude = res.data.result.location.lng;
                    _data.retLatitude = res.data.result.location.lat;
                    that.setData(_data);
                }
            }
        });
        
    },
    /**
     * 时间选择框
     */
    bindDateChange(e) {
        var _index = e.currentTarget.dataset.index,
            _data = {};
        if (_index == 1) {
            _data.start_time = e.detail.value;
        } else if(_index == 2){
            _data.end_time = e.detail.value;
        }else if (_index == 3){
            _data.hourIndex1 = e.detail.value;

        }else {
            _data.hourIndex2 = e.detail.value;

        }
        this.setData(_data);
    },
    /**
     * 配置项的分类维护的数据
     */
    valueWarpInput(e){
        var {cateArr, cateIndex , goods_price } = this.data,
            _index = e.detail.value,
            goods_bond = "",
            _arr = [];
        if (goods_price) {
            goods_bond = (goods_price * ( cateArr[cateIndex].bond_ratio / 100)).toFixed(2);
            this.setData({
                goods_bond: goods_bond
            });
        }
        util.setValue(e, this, () => {
            this.getRule();
            cateArr[_index].cate_spec.map(i => {
                var _obj = {
                    keys: "",
                    val: "",
                    unit: "",
                    valIndex: 0,
                    unitIndex: 0
                };
                // 设置默认值
                if (i.unit.length > 0) {
                    _obj.unit = i.unit[0];
                    _obj.keys = i.key;
                }
                if (i.val.length > 0) {
                    _obj.val = i.val[0];
                }
                _arr.push(_obj);
            });
            this.setData({
                cateObj: _arr
            });
        });

    },
    /**
     * 通用input 框进行数据的双向绑定
     */
    valueInput(e){
        if (e.currentTarget.dataset.value == 'goods_price'){
            var {goods_price , cateArr , cateIndex} = this.data;
            var goods_bond =((e.detail.value * 1 ) * ( cateArr[cateIndex].bond_ratio / 100)).toFixed(2) ;

            this.setData({
                goods_bond: goods_bond
            });
        }
        util.setValue(e, this);
    },
    /**
     *   配置项 select 逻辑存放处
     */
    valueCommonInput(e) {
        var _val = e.detail.value,
            _index = e.currentTarget.dataset.index,  //这组遍历里面的第几个
            _type = e.currentTarget.dataset.type,    //这组的类型 是 值 还是 单位
            _keys = e.currentTarget.dataset.keys,
            {cateObj, cateArr, cateIndex} = this.data;
        cateObj[_index].keys = _keys;
        if (_type == "unitIndex") {
            cateObj[_index].unit = cateArr[cateIndex].cate_spec[_index].unit[_val];
            cateObj[_index].unitIndex = _val;
        } else {
            cateObj[_index].val = cateArr[cateIndex].cate_spec[_index].val[_val];
            cateObj[_index].valIndex = _val;
        }
        this.setData({
            cateObj: cateObj
        });
    },


    /**
     *   配置项  input框输入绑定出
     */
    valueInputInsert(e) {
        var _val = e.detail.value,
            _index = e.currentTarget.dataset.index,  //这组遍历里面的第几个
            _type = e.currentTarget.dataset.type,    //这组的类型 是 值 还是 单位
            _keys = e.currentTarget.dataset.keys,
            {cateObj} = this.data;
        cateObj[_index].keys = _keys;
        if (_type == "unit") {
            cateObj[_index].unit = _val;
        } else {
            cateObj[_index].val = _val;
        }
        this.setData({
            cateObj: cateObj
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var _now = new Date();
        this.setData({
            start_time: util.forMatterDate(_now),
            end_time: util.forMatterDate(_now)
        },() => {
            this.getGoodsDetail();
            //获取设置过的城市
            this.getSetPlace();
        });


    },
    /**
     * 获取产品 添加分类项
     */
    getGoodsDetail(){
        util.$ajax({
            url: "/?act=getCate"
        }, res => {
            if (res.code == 1) {
                this.setData({
                    cateArr: res.data
                }, () => {
                    var _data = res.data[0].cate_spec,
                        _arr = [];
                    if (_data && _data.length > 0) {
                        _data.map(i => {
                            var _obj = {
                                keys: "",
                                val: "",
                                unit: "",
                                valIndex: 0,
                                unitIndex: 0
                            };
                            // 设置默认值
                            if (i.unit.length > 0) {
                                _obj.unit = i.unit[0];
                                _obj.keys = i.key;
                            }
                            if (i.val.length > 0) {
                                _obj.val = i.val[0]
                            }
                            _arr.push(_obj);
                        });
                        this.setData({
                            cateObj: _arr
                        });
                    }
                });
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.mapCtx = wx.createMapContext('map');
        this.animation = wx.createAnimation({
            duration: 300
        });
        this.getPlace();
    },
    /**
     * 执行确定操作
     */
    confirm() {
        wx.showToast({
            title: "选择成功!",
            icon: "none"
        });
        this.setData({
            hidden: true
        }, () => {
            this.reset();
            this.getRule();
        });



    },
    /**
     * 选择提货方式
     */
    chooseYD() {
        var {yd} = this.data;
        this.setData({
            yd: !yd
        });
    },
    chooseZT() {
        var {zt} = this.data;
        this.setData({
            zt: !zt
        });
    },
    chooseQT() {
        var {qt} = this.data;
        this.setData({
            qt: !qt
        });
    },
    /**
     *  拉取计费规则
     */
    getRule() {
        var { area_id , cateArr , cateIndex} = this.data;
        if (area_id ) {
            util.$ajax({
                url: "/?act=getService",
                data: {
                    area_id: area_id,
                    cate_id: cateArr[cateIndex].id
                },
                type: "post"
            }, res => {
               this.setData({
                   ruleArr: res.data
               });
            });
        }
    },
    cancel() {
        this.setData({
            hidden: true
        });

    },
    /**
     * 拍照
     */
    takePhoto(e) {
        var that = this, {goods_img , interim} = this.data, arr = [];
        if (goods_img.length == 5){
            util.$alert("超出上传图片的最大数量!");
            return false;
        }
        wx.chooseImage({
            success(res) {

                var tempFilesSize = res.tempFiles[0].size;  //获取图片的大小，单位B

                if(tempFilesSize >= 20000000) {
                    util.$alert("上传图片不能大于20M");
                    return false;
                }

                //图片展示, 临时存放处, 展示的同时再往后台上传, 避免性能体验上的问题.
                that.setData({
                    interim: [...interim,res.tempFilePaths[0]]
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
                            }else {
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
    /**
     * 图片删除
     */
    deleteImg(e) {
        var {goods_img , interim} = this.data ,
            _index = e.currentTarget.dataset.index;
        goods_img.splice(_index , 1);
        interim.splice(_index , 1);
        var _data = {};
        _data.goods_img = goods_img;
        _data.interim = interim;
        this.setData(_data);


    },
    /**
     * 一开始获取地图的主视角位置.
     */
    getPlace() {
        var that = this;
        //获取当前地点
        if (wx.getStorageSync('longitude') && wx.getStorageSync('latitude')) {
            this.setData({
                rstLongitude: wx.getStorageSync('longitude'),
                retLatitude: wx.getStorageSync('latitude')
            });
        } else {
            wx.getLocation({
                type: 'wgs84',   //默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标 
                success: function (res) {
                    wx.setStorage({//存储到本地
                        key: "latitude",
                        data: res.latitude
                    });
                    wx.setStorage({//存储到本地
                        key: "longitude",
                        data: res.longitude
                    });
                    that.setData({
                        rstLongitude: res.longitude,
                        retLatitude: res.latitude
                    });
                }
            });
        }
    },
    /**
     * 页面滑动
     */
    translate: function () {
        this.setData({
            isShow: true
        });
        this.animation.translate(0, '-100%').step();
        var _data = {};
        _data.animation = this.animation.export();
        _data.overHidden = true;
        this.setData(_data);
    },
    /**
     * 返回
     */
    reset: function () {
        this.animation.rotate(0, 0)
            .scale(1)
            .translate(0, 0)
            .skew(0, 0)
            .step({duration: 300});
        var _data = {};
        _data.animation = this.animation.export();
        _data.overHidden = false;
        this.setData(_data , () => {
            setTimeout(() => this.setData({
                isShow: false
            }),300);
        })
    },
    /**
     * 获取地点
     */
    selectPlace(){
        let {markers , chooseData} = this.data,
            that = this;
        if (markers.length > 0) {
            if (this.checkCity(chooseData)){
                that.setData({
                    hidden: false
                });
            }else {
                wx.showToast({
                    title: "此地区暂未开通,不能添加,具体可以咨询管理员!",
                    icon: "none",
                    duration: 4000
                });
            }
        } else {
            wx.showToast({
                title: "暂未选择地点,请点击地图选择位置!",
                icon: "none"
            });
        }
    },
    returnDetail(e){
        console.log(e);
    },
    /**
     * 点击地区  渲染圆心  以及标记
     */
    returnPlace(e){
        var arr = [],
            _arr = [],
            obj = {},
            _obj = {},
            that = this;
        this.mapCtx.getCenterLocation({
            success(res) {
                var _data = {};
                _data.makers = arr;
                _obj.id = 1;
                _obj.longitude = res.longitude;
                _obj.latitude = res.latitude;
                _obj.width = 25;
                _obj.height = 40;
                _obj.iconPath = "/images/others.png";
                arr.push(_obj);

                obj.latitude = res.latitude;
                obj.longitude = res.longitude;
                obj.radius = 500;
                obj.color = "#eff8f966";
                obj.fillColor = "#a5dbe266";
                obj.strokeWidth = 1;
                _arr.push(obj);
                var data = {};
                data.circles = _arr;
                data.markers = arr;
                that.setData(data);
                //获取详细地址


                util.$ajax({
                    url: "/?act=getInfoByLocation",
                    data: {
                        lat: _arr[0].latitude,
                        lng: _arr[0].longitude
                    },
                    loading:2
                }, res => {
                    _data.place = res.data.address;
                    _data.area_id = res.data.area_id;
                    _data.chooseData = res.data;
                    that.setData(_data);
                });
            }
        });
    },
    /**
     * 判断所选城市 是否是开设过的城市
     */
    checkCity(_item){
        let {setArr} = this.data , _mark = false;
        setArr.forEach(i => {
            if (i.key == _item.province_id){
                i.children.forEach(_i => {
                    if (_i.key = _item.city_id) {
                        _i.children.forEach($i => {
                           if ($i.key == _item.region_id) {
                               $i.children.forEach(_last => {
                                   if (_last.key == _item.area_id){
                                       _mark = true;
                                   }
                               })
                           }
                        });
                    }

                })
            }
        });
        return _mark;
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