/**
 * 新增一条数据 然后其中有个字段需要自增的 sql    其中 uid 是需要自增的
 * 'INSERT INTO sys_user (uid, create_time , mobile , name, type , status , pwd) select max(uid)+1, ? , ? , ? , 1 , 1 , 123456 from sys_user';
 * 
 */