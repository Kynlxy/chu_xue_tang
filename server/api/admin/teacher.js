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
        var _sql = 'SELECT A.id , A.uid, A.name , A.status, A.create_time, A.mobile  , count(b.teacher_id) AS class_total FROM `sys_user`  AS A LEFT JOIN  `class_detail`  AS B ON A.uid = B.teacher_id  WHERE A.type = 2 ',
        _key = req.query.searchData,
        _status = req.query.status,
        _page = + req.query.page;
        if (_key) {
            _sql +=  ` AND A.name LIKE "%${_key}%" `;
        }
        if (_status) {
            _sql += `AND A.status = ${_status}`;
        }
        _sql += ` GROUP BY A.id  ORDER BY A.create_time desc`;
        if (_page) {
            _sql +=  ` limit ${(_page  - 1)* 10}  , ${_page * 10}`;
        }
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
            var _totalSql = 'select count(100) AS total FROM `sys_user` WHERE type = 2 ';
            if (_key) {
                _totalSql +=   ` AND name LIKE "%${_key}%" `;
            }
            if (_status) {
                _totalSql += `AND status = ${_status}`;
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
    },
    /**
     * 添加教师
     */
    addTeacher: function (req, res) {
        var _create_time = req.query.time,
        _mobile = req.query.mobile,
        _name = req.query.name ,
        _searchSql = `SELECT * FROM sys_user WHERE mobile = ${_mobile} OR name = '${_name}' `;
        // 判断是否有同名 或者 手机号一样的
        client.query(_searchSql, (err , rst) => {
            if (err) {
                return res.json({
                    code: 0,
                    message: err.message
                });
            } else {
                if (rst && rst.length > 0) {
                    return res.json({
                        code: 0,
                        message: "姓名或者手机号重复了"
                    });
                } else {
                    var _sql = 'INSERT INTO `sys_user` (uid, create_time , mobile , name, type , status , pwd) select max(uid)+1, ? , ? , ? , 2 , 1 , 123456 from `sys_user`';
                    client.query(_sql, [_create_time, _mobile, _name], (err, results) => {
                        if (err) {
                            return res.json({
                                code: 0,
                                message: err.message
                            });
                        } else {
                            return res.json({
                                code: 1,
                                message: "添加成功"
                            });
                        }
                    });
                }
                
            }
        });
    },
    //冻结或者解冻老师
    changeTeacherStatus(req, res) {
        var _uid = req.body.uid,
            _status = req.body.status,
            _sql = `UPDATE sys_user SET status = ? WHERE uid = ?`;
        client.query(_sql, [_status, _uid], (err, rst) => {
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
    }
};

exports.AdminTeacher = AdminTeacher;
