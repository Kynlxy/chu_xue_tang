/**
 * 用户表的相关接口操作
 * author:kyn
 * date:2019-10-21
 */
//载入公用模块
var {
	client
} = require('../../connect.js');

//引入token工具
var JwtUtil = require('../../utils/jwt.js');

var formidable = require('formidable');

var User = {
	/**
	 * 登录
	 * @param req:object 请求对象
	 * @param res:object http输出对象
	 */
	login: function(req, res) {		
		var mobile = req.body.mobile,
			pwd = req.body.pwd,
            sql = "select * from `sys_user` WHERE `mobile`= ? AND `pwd` = ?";
		client.query(sql, [mobile, pwd], (err, results) => {
			if (err) {
				return res.json({
					code: 0,
					message: err.message
				});
			} else {
				if (!results || results.length == 0) {
					return res.json({
						code: 0,
						message: "账号或密码错误"
					});
				} else {
					let info = results[0];
					//判断用户是否禁用
					if (info.status == 2) {
						return res.json({
							code: 0,
							message: "当前账户已被禁用"
						});
					}
					delete info.pwd;
					// 登陆成功，添加token验证
					let uid = info.uid.toString();
					// 将用户id传入并生成token
					let jwt = new JwtUtil(uid);
					let token = jwt.generateToken();

					return res.json({
						code: 1,
						info: info,
						token: token,
						message: "登录成功"
					});
				}
			}
		});
	}
}

exports.User = User;
