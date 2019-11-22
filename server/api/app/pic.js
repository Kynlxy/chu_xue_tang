//载入公用模块
var {client} = require('../../connect.js');

//var images = require('images'); //图片压缩用的
var fs = require("fs");

var formidable = require("formidable");

var multer  = require('multer');


// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, 'upload/');    
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + "-" + file.originalname);  
    }
});

// 创建文件夹
var createFolder = function(folder){
    try{
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder); 
    }catch(e){
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = './upload/';
createFolder(uploadFolder);

// 创建 multer 对象
var upload = multer({ storage: storage });

module.exports  = {
	/**
	 * 上传 图片资源
	 */
    upload: upload,
    /**
     * 图片插入
     */
    insertPic: function (_path, res) {
        var _sql = 'INSERT INTO `file_picture`  (`url`)  VALUES  (?)';
        client.query(_sql , [_path], (err, results) => {
            if (err) {
                return res.json({
                    code: -10,
                    message: err.message
                });
            } else {
                return res.json({
                    code: 1,
                    message: '上传成功',
                    fid: results.insertId
                });   
            }
        });
    },
    /**
     *  获取图片资源
     */
    getImg: function (req, res) {
        var _sql = 'SELECT * FROM `file_picture` WHERE id = ?',
            _page = req.query.page,
            _fid = req.query.id;
        if (_page) {
            _sql +=  ` limit ${(_page  - 1)* 10}  , ${_page * 10}`;
        }
        client.query(_sql , [_fid], (err, results) => {
            if (err) {
                return res.json({
                    code: -10,
                    message: err.message
                });
            } else {
                if (results && results.length > 0) {
                    fs.readFile(results[0].url, "binary", function(err, data) {
                        if (err) {
                            return res.json({
                                code: 0,
                                message: err.message
                            });
                        } else {
                            res.write(data, "binary");
                            res.end("");
                        }
                    });
                } else {
                    return res.json({
                        code: -10,
                        message: '未获取到图片',
                    }); 
                }
                 
            }
        });
    }

}

