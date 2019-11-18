var session = require('express-session');
var mysql = require('mysql');
var MySQLStore = require('express-mysql-session')(session);

var mysqlOption = {
	host: 'localhost',
	user: 'root',
	password: '123456',
	port: 3306,    
    // socketPath:'/var/lib/mysql/mysql.sock',
    multipleStatements: true, //允许执行多条语句
    useConnectionPooling:true, //
    waitForConnections:true,
    wait_timeout:28800,
	schema:{
		tableName: 'session',
		columnNames:{
			session_id: 'session_id',
            expires: 'expires',
            data: 'data'
		}
	}
};

var sqlconnection = mysql.createConnection(mysqlOption);
global.FORMATTERMiNUTE = function (_date){
    var date = new Date(_date);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());

    var strDate = Y+M+D+h+m+s;
    return strDate;
}
var sessionStore = new MySQLStore({},sqlconnection);
//查询使用数据库
sqlconnection.query("use " + 'chu_xue_tang');
module.exports =  {
	client:sqlconnection,
	sessionStore:sessionStore
}
