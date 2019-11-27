/**
 * 新闻相关
 * author:kyn
 * date:2019-11-22
 */
//载入公用模块
var {
    client
} = require('../../connect.js');
let fs = require('fs-extra');
var formidable = require('formidable');

var AdminNews = {
    /**
     *  新增新闻
     */
    addNews: function (req, res ) {
        let _title = req.body.title,
            _fid = req.body.fid,
            _type = req.body.type,
            _content = req.body.content,
            _create_time = global.FORMATTERMiNUTE(new Date()),
            _sql = 'INSERT INTO news_list (title , fid ,type , content , create_time ) VALUES ( ? , ? , ? , ? , ?)';
        client.query(_sql, [_title , _fid, _type ,_content , _create_time], (err, results) => {
            if (err) {
                return res.json({
                    code: 0,
                    message: err.message
                });
            } else {
                return res.json({
                    code: 1,
                    message: '添加成功!'
                });
            }
        });
    },
    /**
     * 获取新闻列表
     */
    getNewsList: function (req, res) {
        let _status = req.query.status,
            _key = req.query.searchData || '',
            _type = req.query.type,
            _page = req.query.page,
            _sql = `SELECT A.id , A.title , A.fid, A.status,  A.type, A.create_time, A.watch_times  FROM news_list AS A WHERE A.title LIKE "%${_key}%"`;
            if (_status) {
                _sql += ` AND status = ${_status}`;
            }
            if (_type) {
                _sql += ` AND type = ${_type}`;
            }
            if (_page) {
                if (_page) {
                    _sql +=  ` limit ${(_page  - 1)* 10}  , ${_page * 10}`;
                }
            }
        var _ajax = new Promise(resolve => {
            client.query(_sql, (err, results) => {
                if (err) {
                    return res.json({
                        code: 0,
                        message: err.message
                    });
                } else {
                    resolve([results, req, res]);
                }
            });
        }); 
        _ajax.then(([results, req, res]) => {
            var _totalSql = `select count(100) AS total FROM news_list  WHERE title LIKE "%${_key}%"` ;
            if (_status) {
                _totalSql += ` AND status = ${_status}`;
            }
            if (_type) {
                _totalSql += ` AND type = ${_type}`;
            }
            client.query(_totalSql, (err, result) => {
                if (err) {
                    return res.json({
                        code: 0,
                        message: err.message
                    });
                } else {
                    let _obj = Object.assign({
                        code: 1,
                        data: results,
                        message: "获取成功"
                    }, result[0]);
                    return res.json(_obj);
                }
            });
        });
    },
    /**
     * 增加查看次数 
     */
    addWatchTimes: function (req, res) {
        let _id = req.query.id,
            _sql = 'UPDATE news_list SET watch_times = watch_times + 1  WHERE id = ?';
        client.query(_sql, [_id], (err, result) => {
            if (err) {
                return res.json({
                    code: 0,
                    message: err.message
                });
            } else {
                return res.json({
                    code: 1
                });
            }
        });
    },
    /**
     * 获取资讯的类别
     */
    getAllNewsType: function(req , res) {
        let _sql = `SELECT * FROM news_type_dic`;
        client.query(_sql , (err, results) => {
            if (err) {
                return res.json({
                    code: 0,
                    message: err.message
                });
            } else {
                return res.json({
                    code: 1,
                    data: results,
                    message: '获取成功!'
                });
            }
        });
    },
    /**
     * 获取新闻详情
     */
    getNewsDetail: function (req, res) {
        let _id = req.query.id, 
            _sql = 'SELECT * FROM news_list WHERE id = ?';
        client.query(_sql, [_id], (err, result) => {
            if (err) {
                return res.json({
                    code: 0,
                    message: err.message
                });
            } else {
                if (result && result.length > 0) {
                    return res.json({
                        code: 1,
                        data: result[0],
                        message: '获取成功!'
                    });
                } else {
                    return res.json({
                        code: 0,
                        message: '获取失败!'
                    });
                }
            }
        });  
    }
};

exports.AdminNews = AdminNews;
