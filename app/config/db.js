/**
 * mysql 数据库配置
 */

// 生成环境
let sqlConfig = {
    host: 'localhost',
    user: 'root',
    password: 'xxxxxxxx',
    database: 'bbs',
    port: 3306
}

// 本地环境
// process.env.NODE_ENV 取决于package.json里面的配置
if (process.env.NODE_ENV !== 'production') {
    sqlConfig = {
        host: 'localhost',
        user: 'root',
        password: 'xxxxxxxxxx',
        database: 'bbs',
        port: 3306
    };
}

module.exports =sqlConfig;