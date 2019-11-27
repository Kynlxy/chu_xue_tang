/**
 * 课程相关
 * author:kyn
 * date:2019-10-22
 */
//载入公用模块
var {
    client
} = require('../../connect.js');

var formidable = require('formidable');

var AboutClass = {
    /**
     * 获取免费课程 
     */
    getFreeClass(req, res) {
        let _sql = 'SELECT A.* , C.name AS teacher_name FROM `class_detail` AS A  INNER JOIN `sys_user` AS C WHERE C.uid = A.teacher_id AND A.is_open = 1 AND A.status = 1';
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
     * 获取课程
     */
    getClass(req, res) {
        var _uid = req.headers.uid, _type = req.query.type, _sql, _joinData = [];
        if (_type) {
        } else {
            _sql = 'SELECT A.* , C.name AS teacher_name FROM `class_detail` AS A  INNER JOIN `class_user_relation` AS B INNER JOIN `sys_user` AS C WHERE A.class_id = B.class_id AND C.uid = A.teacher_id AND B.student_id = ? ';
            _joinData.push(_uid);
        }
        client.query(_sql, _joinData, (err, results) => {
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
     * 增加记录
     */
    addWatchTimes(req, res , cb) {
        var _classId = req.query.class_id,
            _sql = 'UPDATE `class_detail`  SET  watch_times =  watch_times + 1 WHERE class_id = ?';
        client.query(_sql , _classId , (err, results) => {
            if (err) {
                return res.json({
                    code: 0,
                    message: err.message
                });
            } else {
                cb(req, res);
            }
        });
    },
    /**
     * 获取课程的详情
     */
    getClassDetail(req, res) {
        var _classId = req.query.class_id,
            _sql = 'SELECT A.*, COUNT(A.class_id) AS total  FROM `class_detail` AS A WHERE A.class_id = ? GROUP BY A.id';
        client.query(_sql, _classId, (err, results) => {
            if (err) {
                return res.json({
                    code: 0,
                    message: err.message
                });
            } else {
                return res.json({
                    code: 1,
                    data: results[0],
                    message: "获取成功"
                });
            }
        });
    },
    /**
     * 获取授课老师的详情
     */
    getClassTeacherDetail(req, res ) {
        var _classId = req.query.class_id,
            _sql = 'SELECT  B.name AS teacher_name, B.mobile , B.create_time  FROM  `class_detail` AS A INNER JOIN `sys_user` AS B ON   A.teacher_id = B.uid WHERE A.class_id = ?';
        client.query(_sql, _classId, (err, results) => {
            if (err) {
                return res.json({
                    code: 0,
                    message: err.message
                });
            } else {
                return res.json({
                    code: 1,
                    data: results[0],
                    message: "获取成功"
                });
            }
        });
    }
}

exports.AboutClass = AboutClass;
