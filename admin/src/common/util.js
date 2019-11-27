"use strict";
import axios from "axios";
import qs from "qs";

import {Message} from 'element-ui';

var util = {
  $success (_msg) {
    Message({
      type: 'success',
      message: _msg
    });
  },
  $error (_msg) {
    Message({
      type: 'error',
      message: _msg
    });
  },
  $alert (_msg) {
    Message(_msg);
  },
  forMatterMinute(_date){
    var date = new Date(_date);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());

    var strDate = Y+M+D+h+m+s;
    return strDate;
  },
  /**
   * 获取url参数
   */
  getParam(b) {
    var c = document.location.href;
    if (!b) {
      return c
    }
    var d = new RegExp("[?&]" + b + "=([^&]+)", "g");
    var g = d.exec(c);
    var a = null;
    if (null != g) {
      try {
        a = decodeURIComponent(decodeURIComponent(g[1]))
      } catch (f) {
        try {
          a = decodeURIComponent(g[1])
        } catch (f) {
          a = g[1]
        }
      }
    }
    return a;
  },
  /**
   * 写入cookie
   * @param key
   * @param val
   * @param day
   */
  setCookies(key, val, day) {
    //获取当前日期
    var expiresDate = new Date();
    //设置生存期，一天后过期
    expiresDate.setDate(expiresDate.getDate() + (day ? day : 1));
    document.cookie = key + "=" + val + ";expires= " + expiresDate.toGMTString() + ";path=/";//标记已经访问了站点
  },
  /**
   * 获取cookies
   * @param key
   */
  getCookies(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return null;
  },
  /**
   * 删除cookies
   * @param key
   */
  delCookies(key) {
    //获取当前日期
    var expiresDate = new Date();
    //设置生存期，一天后过期
    expiresDate.setDate(expiresDate.getDate() - 100);
    document.cookie = key + "=;expires= " + expiresDate.toGMTString() + ";path=/";//标记已经访问了站点
  },
  /**
   * 清空所有cookies
   */
  delAllCookies() {
    //获取所有的cookies key
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      for (var i = keys.length; i--;) {
        this.delCookies(keys[i]);
      }
    }
  },
  checkImg(_name){
    var index = _name.indexOf("."); //（考虑严谨用lastIndexOf(".")得到）得到"."在第几位
    _name = _name.substring(index); //截断"."之前的，得到后缀
    if (_name != ".bmp" && _name != ".png" && _name != ".gif" && _name != ".jpg" && _name != ".jpeg") {  //根据后缀，判断是否符合图片格式
      return false;
    }
    return true;
  },
  //http请求封装
  $ajax(obj, cb){
    if (typeof obj == 'object' && obj.url) {
      const _type = obj.type ? obj.type : 'get';                // 是否是get 请求  默认是get
      const _login = obj.login ? obj.login : '1';             // 是否需要登录   默认是需要登录否则跳转到登录页面
      const _showError = obj.mistake ? obj.mistake : '1';      // 是否有报错信息  默认是有
      const _data = obj.data ? obj.data : {};
      var _obj = {
        method: _type,
        url: obj.url,
        headers: {
          token: localStorage.getItem('token')
        }
      };
      if (_type == 'get' || _type == 'GET') {
        _obj.params = _data;
      } else {
        _obj.data = qs.stringify(_data);

      }
      axios(_obj).then((_res) => {
        const res = _res.data;
        if (+res.code === 1) {
          if (cb && typeof cb === 'function') {
            cb(res);
          }
        } else {
          if (+res.code === 403 && +_login === 1) {
            if (+_showError === 1) {
              this.$error('未检测到登录!');
              setTimeout(() => {
                location.hash = 'login'
              },1000);
            }
          } else {
            if (+_showError === 2) {
              cb(res);
            } else {
              this.$error(res.msg || res.message || '服务器出小差了');
            }
          }
        }
      }).catch((res) => {
        this.$error(res.msg || res.message || '服务器出小差了');
        return;
      });
    }
  },
  /**
   * 深拷贝
   */
  deepClone (obj) {

    if (Object.prototype.toString.call(obj).slice(8, -1) != 'object' && Object.prototype.toString.call(obj).slice(8, -1) != 'Array') {
      return obj;
    }

    var newObj = obj.constructor === Array ? [] : {}; //开辟一块新的内存空间

    for (var i in obj) {
      newObj [i] = this.deepClone(obj [i]); //通过递归实现深层的复制
    }

    return newObj;
  },
  Tools: {
    /**
     * 手机号码格式是否正确
     * @param mobile:string 手机号码 11位
     * @return true/false
     */
    isMobile: function (mobile) {
      if (mobile && mobile.length != 11) return false;
      var reg = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$|19[0-9]{9}$/;
      if (mobile == '' || !reg.test(mobile)) {
        return false;
      }
      return true;
    },
    /**
     * 身份证号码格式是否正确
     * @param cardNo:string 身份证号码
     * @return true/false
     */
    isIdCardNo: function (cardNo) {
      if (cardNo == '' || !/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/i.test(cardNo)) {
        return false;
      }
      return true;
    },

    /**
     * 邮箱地址格式是否正确
     * @param _email:string 邮箱地址
     * @return true/false
     */
    isEmail: function (_email) {
      var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (_email == '' || !reg.test(_email)) {
        return false;
      }
      return true;
    },

    /**
     * 公用处理数据---格式化金额  保留2位小数 千分位逗号
     * @param {type} number
     * @param {type} decimals
     * @param {type} thousands_sep
     * @param {type} dec_point
     * @param {type} roundtag  舍入参数，默认 "round" 四舍五入 ,"ceil" 向上取,"floor"向下取,
     * @returns {unresolved}
     */
    priceFormat: function (number, decimals, thousands_sep, dec_point, roundtag) {
      /*
       * 参数说明：
       * number：要格式化的数字
       * decimals：保留几位小数
       * dec_point：小数点符号
       * thousands_sep：千分位符号
       * roundtag:舍入参数，默认 "round" 四舍五入 ,"ceil" 向上取,"floor"向下取,
       * */
      //if(!number) return 0.00*1;
      number = (number + '').replace(/[^0-9+-Ee.]/g, '');
      roundtag = roundtag || "round"; //"ceil","floor","round"
      var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
          var s = n.toString();
          var sArr = s.split(".");
          var m = 0;
          try {
            m += sArr[1].length;
          } catch (e) {
          }

          if (prec > m) {
            return s;
            /*'' + Number(s.replace(".", "")) / Math.pow(10, m);*/
          } else {
            sArr[1] = Math[roundtag](Number(sArr[1]) / Math.pow(10, m - prec));
            while (sArr[1].toString().length < prec) {
              sArr[1] = '0' + sArr[1];
            }
            return sArr.join('.');
          }
        };
      s = (prec ? toFixedFix(n, prec) : '' + Math.floor(n)).split('.');
      var re = /(-?\d+)(\d{3})/;
      while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
      }

      if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
      }
      return s.join(dec);
    }
  },
  // 格式化时间 返回 年月日的格式
  forMatterDate(_date){
    var date = new Date(_date);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate();

    return (Y + M + D);
  }
};
export {util}  ;
