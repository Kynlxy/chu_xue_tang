/**
 * banner相关
 * author:kyn
 * date:2019-11-22
 */
//载入公用模块
var {
    client
} = require('../../connect.js');
let fs = require('fs-extra');
var formidable = require('formidable');

var AdminBanner = {
     /*
     * 获取banner图
     */
    getBanner: function (req, res) {
        let _status = req.query.status,
            _sql = 'SELECT * FROM class_banner';
        if (_status) {
            _sql += ` WHERE status= ${_status}`;
        }
        _sql += ' ORDER BY sort ASC';
        client.query(_sql, (err, results) => {
            if (err) {
                return res.json({
                    code: 0,
                    message: err.message
                });
            } else {
                return res.json({
                    code: 1,
                    data: results,
                    message: "获取成功"
                });
            }
        });
    },
    /**
     * 新增banner
     */
    addBanner: function (req, res) {
        let _fid = req.query.fid,
            _sql = 'INSERT INTO `class_banner` (sort ,fid , status) (SELECT IFNULL (MAX(sort) + 1, 1) , ? , 1 FROM `class_banner`)';
        client.query(_sql , [_fid], (err, results) => {
            if (err) {
                return res.json({
                    code: 0,
                    message: err.message
                });
            } else {
                return res.json({
                    code: 1,
                    message: '操作成功'
                });
            }
        });    
    },
    /**
     * 修改banner状态
     */
    changeBannerStatus: function (req , res){
        var _id = req.query.id,
            _status = req.query.status,
            _sql = 'UPDATE class_banner SET  status = ? WHERE id = ?';
        client.query(_sql , [_status , _id], (err, results) => {
            if (err) {
                return res.json({
                    code: 0,
                    message: err.message
                });
            } else {
                return res.json({
                    code: 1,
                    message: '操作成功'
                });
            }
        });  
    },
    /**
     * 删除某张banner
     */
    deleteBanner: function(req, res) {
        let _id = req.body.id,
            _sql = 'DELETE FROM class_banner WHERE id = ?';
        client.query(_sql, [_id] , (err, results) => {
            if (err) {
                return res.json({
                    code: 0,
                    message: err.message
                });
            } else {
                return res.json({
                    code: 1,
                    message: '操作成功'
                });
            }
        });  
    },
    /**
     * 切换banner的位置
     */
    changeBannerSort: function (req, res) {
        let _id = req.body.id,
            _sort = req.body.sort,
            _sql = 'UPDATE class_banner SET sort = ? WHERE id = ?';
        client.query(_sql , [_sort, _id] , (err, results) => {
            if (err) {
                return res.json({
                    code: 0,
                    message: err.message
                });
            } else {
                return res.json({
                    code: 1,
                    message: '操作成功'
                });
            }
        });      
    },
};

exports.AdminBanner = AdminBanner;
