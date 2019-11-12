/**
 * 课程相关
 * author:kyn
 * date:2019-10-29
 */
//载入公用模块
var {
    client
} = require('../../connect.js');

var formidable = require('formidable');

var AdminClass = {
    /**
     * 获取所有课程并且返回总条数
     */
    getAllClass(req, res) {
        var _sql = 'SELECT H.* , b.name AS teacher_name FROM (SELECT A.* ,  count(c.id) AS student_total FROM `class_detail` AS A LEFT JOIN `class_user_relation` AS C ON C.class_id = A.class_id  GROUP BY A.id ) AS H INNER JOIN `sys_user` AS B  ON H.teacher_id = B.uid',
        _key = req.query.searchData,
        _page = + req.query.page;
        if (_key) {
            _sql +=  ` WHERE class_name LIKE "%${_key}%" `;
        }
        _sql += ` limit ${(_page  - 1)* 10}  , ${_page * 10} `;
        var _ajax = new Promise(resolve => {
            client.query(_sql, (err, results) => {
                if (err) {
                    return res.json({
                        code: 0,
                        message: err.message
                    });
                } else {
                    resolve([results, req , res]);
                }
            });
        });
        _ajax.then(([results , req , res]) => {
            var _totalSql = 'select count(100) AS total FROM `class_detail`';
            if (_key) {
                _totalSql +=   ` WHERE class_name LIKE "%${_key}%" `;
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
                    },result[0]);
                    return res.json(_obj)
                }
            });  
        });
        
    }
};

exports.AdminClass = AdminClass;
