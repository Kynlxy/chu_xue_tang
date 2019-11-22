/**
 * API开放接口定义
 * author:stepday
 * date:2019-01-17
 */
const express = require('express');
var session = require('express-session');
let path = require('path');

const app = express();

var { sessionStore } = require('./connect.js');

//引入接口文件
const { User } = require('./api/app/user.js');

//引入接口文件
const { AboutClass } = require('./api/app/class.js');

const { AdminClass } = require ('./api/admin/class.js');

const { AdminStudent } = require ('./api/admin/student.js');

const { AdminTeacher } = require ('./api/admin/teacher.js');

const { Video } = require ('./api/video/video.js');

const { AdminBanner } = require ('./api/admin/banner.js');

//引入接口文件
const Pic = require('./api/app/pic.js');

//引入token工具
var JwtUtil = require('./utils/jwt.js');

//解析表单的插件
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(express.static(path.join(__dirname)));

app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));
//检测token的有效性
app.use(function (req, res, next) {
    //除去数组内的一些url不检测token外，其他的多有请求都需要进行token校验
	let noNeedCheckUrl = [		
		"/api/user/login",//登录
		"/api/pic/getImg",//获取图片
		"/api/pic/uploadImg",//上传图片
		"/api/video/upload", //视频上传
		"/api/video/check/file", //检查视频
		"/api/video/check/chunk",//检查块
		"/api/video/merge",//合并
		"/api/video/play"//播放

	];
	//url 去掉参数 如果是get模式的话
	let _url = req.url.split('?')[0];
    if (!noNeedCheckUrl.includes(_url)) {
        let token = req.headers.token; //获取headers内的token
        let jwt = new JwtUtil(token);
        let result = jwt.verifyToken();
        // 如果考验通过就next，否则就返回登陆信息不正确
        if (result == 'err') {
            res.send({code: 403, message: '登录已过期,请重新登录',path:_url});
        } else {
            next();
        }
    } else {
        next();
    }
});

//用户登录
app.post('/api/user/login', (req, res) => {
	User.login(req, res);
});

//获取某个用户的课程
app.get('/api/class/getClass', (req, res) => {
	AboutClass.getClass(req, res);
});
//获取具体某个课程的详情
app.get('/api/class/getClassDetail', (req, res) => {
	AboutClass.addWatchTimes(req,res, AboutClass.getClassDetail);
});
//获取具体某个授课老师的详情信息
app.get('/api/class/getClassTeacherDetail', (req, res) => {
	AboutClass.getClassTeacherDetail(req, res);
});
//上传
app.post('/api/pic/uploadImg', Pic.upload.single('file') ,(req, res,next) => {
    let _path = req.file.path;
    Pic.insertPic(_path, res);
});
//获取图片
app.get('/api/pic/getImg', (req,res) => {
    Pic.getImg(req, res);
});

/**
 * admin接口开始
 */

 //获取banner
app.get('/api/class/getBanner', (req, res) => {
	AdminBanner.getBanner(req, res);
});
//上传banner
app.get('/api/class/addBanner', (req , res) => {
	AdminBanner.addBanner(req ,res);
});
//修改banner状态
app.get('/api/class/changeBannerStatus', (req , res) => {
	AdminBanner.changeBannerStatus(req ,res);
});
//删除某张banner
app.post('/api/class/deleteBanner', (req , res) => {
	AdminBanner.deleteBanner(req, res);
});
//切换banner的位置
app.post('/api/class/changeBannerSort', (req , res) => {
	AdminBanner.changeBannerSort(req, res);
});

//获取课程列表
app.get('/api/admin/class/getAllClass' , (req, res) => {
	AdminClass.getAllClass(req, res);
});
//获取某个课程的学习的学生
app.get('/api/admin/class/getClassStudent', (req, res) => {
	AdminClass.getClassStudent(req, res);
});
//为某个课程新增 或者删除学生 
// type：1代表新增   type：2代表删除
app.get('/api/admin/class/changeClassUserRelation', (req, res) => {
	AdminClass.changeClassUserRelation(req, res);
});
//新增课程
app.post('/api/admin/class/addClass', (req, res) => {
	AdminClass.addClass(req, res);
});
//删除课程 
app.post('/api/admin/class/deleteClass', (req, res) => {
	AdminClass.deleteClass(req, res);
});
//获取所有学生列表
app.get('/api/admin/student/getAllStudent', (req, res) => {
	AdminStudent.getAllStudent(req, res);
});
//新增一个学生
app.get('/api/admin/student/addStudent', (req, res) => {
	AdminStudent.addStudent(req, res);
});
//冻结或者解冻学生
app.post('/api/admin/student/changeStudentStatus', (req, res) => {
	AdminStudent.changeStudentStudent(req, res);
});
//新增一个教师
app.get('/api/admin/teacher/addTeacher', (req, res) => {
	AdminTeacher.addTeacher(req, res);
});
//冻结或者解冻老师
app.post('/api/admin/teacher/changeTeacherStatus', (req , res) => {
	AdminTeacher.changeTeacherStatus(req, res);
});
//获取所有教师列表
app.get('/api/admin/teacher/getAllTeacher', (req, res) => {
	AdminTeacher.getAllTeacher(req, res);
});


//视频上传
app.all('/api/video/upload' , (req, res) => {
	Video.videoUpload(req, res);
});
//视频检查
app.all('/api/video/check/file' , (req, res) => {
    Video.checkedFile(req, res);
});
//检查块
app.all('/api/video/check/chunk' , (req, res) => {
    Video.checkedChunk(req, res);
});
//视频合并
app.all('/api/video/merge' , (req, res) => {
    Video.fileMerge(req, res);
});
//视频检查
app.all('/api/video/play' , (req, res) => {
    Video.videoPlay(req, res);
});

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时
		"H+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};
//监听端口服务
app.listen(3080, () => {
	
});

//监听全局异常情况 不中断服务
process.on('uncaughtException', function(err) {
	console.log('Caught exception: ' + err);	
});
