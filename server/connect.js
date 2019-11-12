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
var sessionStore = new MySQLStore({},sqlconnection);
//查询使用数据库
sqlconnection.query("use " + 'chu_xue_tang');
module.exports =  {
	client:sqlconnection,
	sessionStore:sessionStore
}
