var Sequelize = require('sequelize')
// 导入数据库配置
var db = require('../config/db')

var sequelize = new Sequelize(db.database, db.user, db.password, {
    logging: function(sql) {
        // logger为log4js的Logger实例
        if(process.env.NODE_ENV !== 'production'){
            console.log(sql)
        }
    },
    port:db.port,
    host: db.host,
    dialect: 'mysql',
    dialectOptions: {
        dateStrings: true,
        typeCast: true
    },
    pool: {
        max: 20,
        min: 1,
        acquire: 60000,
        idle: 10000
    },
    timezone: '+08:00' //东八时区
});

exports.sequelize = sequelize;

exports.defineModel = function (name, attributes) {
    var attrs = {};
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                // allowNull: false
            };
        }
    }
    attrs.version = {
        type: Sequelize.BIGINT,
        // allowNull: false
    };
    attrs.createUser = {
        type: Sequelize.STRING,
        allowNull: false
    };
    attrs.updateUser = {
        type: Sequelize.STRING,
        allowNull: false
    };
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: true,
        paranoid: true, 
        charset: 'utf8mb4', 
        collate: 'utf8mb4_general_ci',
        hooks: {
            beforeBulkCreate: function(obj){
                obj.version = 0 ;
            },
            beforeValidate: function(obj){
                if(obj.isNewRecord){
                    console.log('first');
                    obj.version = 0 ; 
                }else{
                    console.log('not first');
                    obj.version = obj.version + 1 ;
                }
            }
        }
    });
};
