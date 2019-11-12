/**
 * Created by kyn on 19/1/10.
 * form表单验证方法
 */
"use strict";

var KYN_VALIDATION = (function (win) {
    /**
     *  设计一个验证类
     */
    var Validation = function () {

        //创建一个开关去判断弹窗是否设置
        var _isAlert = false,

        // 外部存写入需要验证的规则

            _outRule = [],

        // 内部的验证方法库

            _rule = {
                maxLength: function (_obj) {
                    var _ruleLength = _obj['length'] ? _obj['length'] : 6;
                    if (_obj['val'] * 1 > _ruleLength * 1) {
                        _alert(_obj['errMsg']);
                        return false;
                    } else {
                        return true;
                    }
                },
                minLength: function (_obj) {
                    var _ruleLength = _obj['length'] ? _obj['length'] : 1;
                    if (_obj['val'] * 1 < _ruleLength * 1) {
                        _alert(_obj['errMsg']);
                        return false;
                    } else {
                        return true;
                    }
                },
                isHaving: function (_obj) {
                    if (_obj['val'] == "" || _obj['val'] == null || _obj['val'] == 'undefined' || _obj['val'].length == 0) {
                        _alert(_obj['errMsg']);
                        return false;
                    } else {
                        return true;
                    }
                },
                isTrue: function (_obj) {
                    if (_obj['val'] == true) {
                        return true;
                    }else {
                        _alert(_obj['errMsg']);
                        return false
                    }
                },
                isMobile: function (_obj) {
                    if (_obj['val'] && _obj['val'].length != 11){
                        _alert(_obj['errMsg']);
                        return false;
                    }
                    var reg = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$|19[0-9]{9}$/;
                    if (_obj['val'] == '' || !reg.test(_obj['val'])) {
                        _alert(_obj['errMsg']);
                        return false;
                    }
                    return true;
                }
            },
            /**
             *  自带弹窗 默认alert
             */
            _alert = function (_msg) {
                if (_isAlert) {
                    _alertMsg(_msg)
                } else {
                    wx.showToast({
                        title: _msg,
                        icon: "none"
                    });
                }
            };

        /**
         * 预留外部弹窗方法
         */
        function _alertMsg() {

        }

        /**
         * 写入自定义弹窗方法
         */
        function _setAlertFunction(_fun) {
            if (_fun && typeof _fun == 'function') {
                /**
                 *  改写外部弹窗方法  并且关闭开关
                 */
                _isAlert = true;

                _alertMsg = function (_msg) {
                    return _fun(_msg);
                };

            }
        }

        /**
         * 外部添加验证方案
         * @param _obj
         */
        function _addTestRule(_obj) {
            _outRule.push(_obj);
            return this;
        }

        /**
         * 实现规则的验证
         */

        function _checkRule() {
            for (var i = 0, _length = _outRule.length; i < _length; i++) {

                //对每个方法进行循环进行,当命中上面的错误的时候把外部导入的方法清空 并且结束验证循环


                if (!_rule[_outRule[i]['name']].call(this, _outRule[i])) {

                    _outRule = [];
                    return false;
                }
            }
            return true;
        }

        // 暴露外部接口
        return {
            // 写入弹窗的接口
            setAlertFunction: _setAlertFunction,
            // 导入的条目接口
            addTestRule: _addTestRule,
            // 验证规则的接口
            checkRule: _checkRule
        }
    };
    return Validation;
})();
export default KYN_VALIDATION;