// 公告表模型
var Sequelize = require('sequelize');
var {sequelize} = require('../sequelize.js');
var user = sequelize.define('user',{
   uID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    userName: {
       type:Sequelize.STRING(20), 
       allowNull: false,
    },
    userPassword: {
       type:Sequelize.STRING(20), 
       allowNull: false,
    },
    userNickname: {
        type:Sequelize.STRING(20), 
        allowNull: true,
    },
    userEmail: {
        type:Sequelize.STRING(320),
    },
    userAvatarUrl: {
        type:Sequelize.STRING(100), 
        allowNull: true,
    },
    userBirthday: {
        type:Sequelize.DATEONLY, 
     },
     userStatement: {
        type:Sequelize.STRING(200),
    },
    userGender: {
        type:Sequelize.STRING(2), 
    },
    userRegDate: {
       type:Sequelize.DATEONLY, 
       allowNull: false,
    },
    userStatus: {
        type:Sequelize.INTEGER, 
        allowNull: false,
		defaultValue:0
     },
     banBeginDate: {
        type:Sequelize.DATE, 
     },
},{
    timestamps: false, // 不要默认时间戳 数据库没有时间戳字段时，设置为false，否则报错  SequelizeDatabaseError: Unknown column 'createdAt' in 'field list'
    freezeTableName: true 
});

module.exports = user;