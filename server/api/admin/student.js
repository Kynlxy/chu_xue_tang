/**
 * 学生相关
 * author:kyn
 * date:2019-10-29
 */
//载入公用模块
var {
    client
} = require('../../connect.js');

var formidable = require('formidable');

var AdminStudent = {
    /**
     * 获取所有学生  并且返回总条数
     */
    getAllStudent(req, res) {
        var _sql = 'SELECT A.id,A.uid,A.name,A.create_time, A.mobile , COUNT(B.student_id ) AS class_total FROM `sys_user` AS A LEFT  JOIN  `class_user_relation` AS  B  ON A.uid = B.student_id  WHERE A.TYPE = 1 AND A.status = 1 ',
        _key = req.query.searchData,
        _page = + req.query.page;
        if (_key) {
            _sql +=  ` AND A.name LIKE "%${_key}%" `;
        }
        _sql += ` GROUP BY A.id  ORDER BY A.create_time desc limit ${(_page  - 1)* 10}  , ${_page * 10} `;
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
            var _totalSql = 'select count(100) AS total FROM `sys_user` WHERE type = 1 AND status = 1';
            if (_key) {
                _totalSql +=   ` AND name LIKE "%${_key}%" `;
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
     * 新增学生
     */
    addStudent(req, res) {
        var _create_time = req.query.time,
            _mobile = req.query.mobile,
            _name = req.query.name,
            _searchSql = `SELECT * FROM sys_user WHERE mobile = ${_mobile} OR name = '${_name}' `;
            //先检查是否有相同的账号或者用户名
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
                    var _sql = 'INSERT INTO `sys_user` (uid, create_time , mobile , name, type , status , pwd) select max(uid)+1, ? , ? , ? , 1 , 1 , 123456 from `sys_user`';
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
};

exports.AdminStudent = AdminStudent;
