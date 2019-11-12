/**
 * 教师相关
 * author:kyn
 * date:2019-11-12
 */
//载入公用模块
var {
    client
} = require('../../connect.js');

var formidable = require('formidable');

var AdminTeacher = {
    /**
     * 获取所有教师  并且返回条数。
     */
    getAllTeacher(req, res) {
        var _sql = 'SELECT A.id , A.uid, A.name , A.create_time, A.mobile  , count(b.teacher_id) AS class_total FROM `sys_user`  AS A LEFT JOIN  `class_detail`  AS B ON A.uid = B.teacher_id  WHERE A.type = 2  AND A.status = 1 ',
        _key = req.query.searchData,
        _page = + req.query.page;
        if (_key) {
            _sql +=  ` AND A.name LIKE "%${_key}%" `;
        }
        _sql += ` GROUP BY A.id  ORDER BY A.create_time desc  limit ${(_page  - 1)* 10}  , ${_page * 10} `;
        //查询所有的教师
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
        //返回条数
        _ajax.then(([results , req , res]) => {
            var _totalSql = 'select count(100) AS total FROM `sys_user` WHERE type = 2 AND status = 1';
            if (_key) {
                _totalSql +=   ` WHERE name LIKE "%${_key}%" `;
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

exports.AdminTeacher = AdminTeacher;
