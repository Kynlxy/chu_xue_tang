var {
    client
} = require('../../connect.js');
let formidable = require('formidable');
let fs = require('fs-extra');
let path = require('path');
let concat = require('concat-files');
let opn = require('opn');
let uploadDir = 'videoUpload/uploads';
var Video = {
    /**
     *  检查是否有这个文件
     */
    checkedFile(req ,res) {
        let query = req.query;
        let fileName = query.fileName;
        let fileMd5Value = query.fileMd5Value;
        // 获取文件Chunk列表
        getChunkList(
            path.join(uploadDir, fileName),
            path.join(uploadDir, fileMd5Value),
            data => {
                res.send(data);
            }
        )
    },
    /**
     *  检查是否有这些块
     */
    checkedChunk(req, res) {
        let query = req.query;
        let chunkIndex = query.index;
        let md5 = query.md5;

        fs.stat(path.join(uploadDir, md5, chunkIndex), (err, stats) => {
            if (stats) {
                res.send({
                    stat: 1,
                    exit: true,
                    desc: 'Exit 1'
                });
            } else {
                res.send({
                    stat: 1,
                    exit: false,
                    desc: 'Exit 0'
                });
            }
        });
    },
    /**
     *  文件合并
     */
    fileMerge(req, res) {
        let query = req.query;
        let md5 = query.md5;
        let size = query.size;
        let fileName = query.fileName;
        mergeFiles(path.join(uploadDir, md5), uploadDir, fileName, size, _cb);
        function _cb (err , results ) {
            if (err) {
                return res.json({
                    code: 0,
                    message: err.message
                });
            } else {
                return res.json({
                    code: 1,
                    message: '上传成功',
                    id: results.insertId
                });
            }
        }


    },
    /**
     *  video 上传
     */
    videoUpload(req, res) {
        var form = new formidable.IncomingForm({
            uploadDir: 'videoUpload/tmp'
        });
        form.parse(req, function(err, fields, file) {
            let index = fields.index;
            let total = fields.total;
            let fileMd5Value = fields.fileMd5Value;
            let folder = path.resolve( 'videoUpload/uploads', fileMd5Value);
            folderIsExit(folder).then(val => {
                let destFile = path.resolve(folder, fields.index);
                copyFile(file.data.path, destFile).then(
                    successLog => {
                        res.send({
                            stat: 1,
                            desc: index
                        });
                    },
                    errorLog => {
                        res.send({
                            stat: 0,
                            desc: 'Error'
                        });
                    }
                )
            });
        });
        // 文件夹是否存在, 不存在则创建文件
        function folderIsExit(folder) {
            return new Promise(async (resolve, reject) => {
                let result = await fs.ensureDirSync(path.join(folder));
                resolve(true);
            })
        }
        // 把文件从一个目录拷贝到别一个目录
        function copyFile(src, dest) {
            let promise = new Promise((resolve, reject) => {
                fs.rename(src, dest, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            return promise;
        }
    },
    videoPlay(req, res) {
        var _id = req.query.fid,
            _sql = `SELECT * FROM file_video WHERE id = ${_id}`;
            
        client.query(_sql , (err, results) => {
            if (err) {
                return res.json({
                    code: 0,
                    message: err.message
                });
            } else {
                let path = results[0].url;
                let stat = fs.statSync(path);
                let fileSize = stat.size;
                let range = req.headers.range;
                if (range) {
                    //有range头才使用206状态码
                    let parts = range.replace(/bytes=/, "").split("-");
                    let start = parseInt(parts[0], 10);
                    let end = parts[1] ? parseInt(parts[1], 10) : start + 999999;

                    // end 在最后取值为 fileSize - 1
                    end = end > fileSize - 1 ? fileSize - 1 : end;

                    let chunksize = (end - start) + 1;
                    let file = fs.createReadStream(path, {start, end});
                    let head = {
                        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': chunksize,
                        'Content-Type': 'video/mp4',
                    };
                    res.writeHead(206, head);
                    file.pipe(res);
                } else {
                    let head = {
                        'Content-Length': fileSize,
                        'Content-Type': 'video/mp4',
                    };
                    res.writeHead(200, head);
                    fs.createReadStream(path).pipe(res);
                }
            }
        });
    }
}
// 获取文件Chunk列表
async function getChunkList(filePath, folderPath, callback) {
    let isFileExit = await isExist(filePath)
    let result = {}
    // 如果文件(文件名, 如:node-v7.7.4.pkg)已在存在, 不用再继续上传, 真接秒传
    if (isFileExit) {
        let _sql = `SELECT * FROM file_video WHERE url = '${filePath}'`;
        let _ajax = new Promise(resolve => {
            client.query(_sql, (err, results) => {
                if (err) {

                } else {
                    resolve(results[0].id)
                }
            });
        });
        _ajax.then(_rst => {
            result = {
                stat: 1,
                file: {
                    isExist: true,
                    name: filePath,
                    id: _rst
                },
                desc: 'file is exist'
            }
            callback(result);
        });
       
    } else {
        let isFolderExist = await isExist(folderPath)
        // 如果文件夹(md5值后的文件)存在, 就获取已经上传的块
        let fileList = []
        if (isFolderExist) {
            fileList = await listDir(folderPath)
        }
        result = {
            stat: 1,
            chunkList: fileList,
            desc: 'folder list'
        }
        callback(result);

    }
}

// 文件或文件夹是否存在
function isExist(filePath) {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
            // 文件不存在
            if (err && err.code === 'ENOENT') {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}

// 列出文件夹下所有文件
function listDir(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            // 把mac系统下的临时文件去掉
            if (data && data.length > 0 && data[0] === '.DS_Store') {
                data.splice(0, 1);
            }
            resolve(data);
        })
    })
}
// 合并文件
async function mergeFiles(srcDir, targetDir, newFileName, size , cb ) {
    let targetStream = fs.createWriteStream(path.join(targetDir, newFileName))
    let fileArr = await listDir(srcDir);
    // 把文件名加上文件夹的前缀
    for (let i = 0; i < fileArr.length; i++) {
        fileArr[i] = srcDir + '/' + fileArr[i];
    }
    concat(fileArr, path.join(targetDir, newFileName), () => {
        // 删除文件
        fs.readdirSync(srcDir).map((file) => {
            fs.unlink(`${srcDir}/${file}`,(err) => {
                if (err) {
                    console.log(err);
                } else {
                    // console.log('delete ok');
                }
            });
        });
    });
    //插入数据库
    var _sql = `INSERT INTO file_video (url) VALUES ("${targetDir + '/' + newFileName}")`;
    client.query(_sql,(err, results) => {
        cb(err, results)
    });
}
exports.Video = Video;














