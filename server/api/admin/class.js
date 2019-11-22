/**
 * 课程相关
 * author:kyn
 * date:2019-10-29
 */
//载入公用模块
var {
    client
} = require('../../connect.js');
let fs = require('fs-extra');
var formidable = require('formidable');

var AdminClass = {
    /**
     *  新增一个课程
     */
    addClass(req, res) {
        var _name = req.body.name,
            _teacher_id = req.body.teacher_id,
            _class_introduce = req.body.class_introduce,
            _video_id = req.body.video_id,
            _fid = req.body.fid,
            _create_time = global.FORMATTERMiNUTE(new Date()),
            _sql = `INSERT INTO class_detail (class_id , class_name , class_introduce , create_time , video_id , fid , teacher_id)  SELECT IFNULL (MAX(class_id)+1 ,1 ), '${_name}' , '${_class_introduce}' , '${_create_time}' , ${_video_id} , ${_fid} , ${_teacher_id}  from class_detail`;
        client.query(_sql , (err, results) => {
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
     * 删除课程
     */
    deleteClass(req ,res) {
        let _class_id = req.body.class_id,
            _firstSql = `SELECT * FROM class_user_relation WHERE class_id = ${_class_id}`,
            _sql = `DELETE FROM class_detail WHERE class_id = ${_class_id}`;
        var _ajax = new Promise(resolve => {
            client.query(_firstSql , (err, results) => {
                if (err) {
                    return res.json({
                        code: 0,
                        message: err.message
                    });
                } else {
                    if (results && + results.length > 0) {
                        return res.json({
                            code: 0,
                            message: '该课程还有学生在学习，无法删除'
                        });
                    } else {
                        resolve();
                    }
                }
            });
        });
        _ajax.then(() => {
            let _delete_video_url ,
                _deletSql  = `SELECT B.url FROM file_video AS B INNER JOIN  (SELECT * FROM class_detail WHERE class_id = ${_class_id}) AS A ON B.id = A.video_id` ;
            client.query(_deletSql, (err, results) => {
                if (err) {
                    return res.json({
                        code: 0,
                        message: err.message
                    });
                } else {
                    _delete_video_url = results[0].url;
                    //删除多余的video
                    fs.unlink(_delete_video_url , error => {
                        if (error) {
                            return res.json({
                                code: 0,
                                message: error.message
                            });
                        } else {
                            client.query(_sql , (err, results) => {
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
                    });
                }
            });  
        });
    },
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
    },
    /**
     * 获取这个课程的学生
     */
    getClassStudent(req, res) {
        let _class_id = req.query.class_id, _page = req.query.page,
        _sql =  `SELECT C.uid, C.name, C.create_time, C.mobile FROM  sys_user AS C INNER JOIN (SELECT A.student_id FROM class_user_relation AS A WHERE  A.class_id = ${_class_id} )  AS B ON C.uid = B.student_id `
        if (_page) {
            _sql +=  ` limit ${(_page  - 1)* 5}  , ${_page * 5} `;
        }
        let _ajax = new Promise(resolve => {
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
            var _totalSql = `SELECT COUNT(C.id) AS total FROM  sys_user AS C INNER JOIN (SELECT A.student_id FROM class_user_relation AS A WHERE  A.class_id = ${_class_id} )  AS B ON C.uid = B.student_id  `;
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
    //为某个课程新增 或者删除学生 
    // type：1代表新增   type：2代表删除
    changeClassUserRelation(req, res) {
        let _student_id = req.query.student_id,
            _type = req.query.type,
            _class_id = req.query.class_id,
            _sql;
        if ( + _type === 1) {
             _sql = 'INSERT INTO  `class_user_relation` (student_id , class_id) VALUES (? , ?)';
        } else {
            _sql = 'DELETE FROM class_user_relation WHERE student_id = ? AND class_id = ?';
        }
        client.query(_sql , [_student_id, _class_id] ,(err, results) => {
            if (err) {
                    return res.json({
                        code: 0,
                        message: err.message
                    });
                } else {
                    return res.json({
                        code: 1,
                        message: '操作成功！'
                    });
                }
        });
    },
};

exports.AdminClass = AdminClass;
