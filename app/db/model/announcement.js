// 公告表模型
var Sequelize = require('sequelize');
var {sequelize} = require('../sequelize.js');

var announcement = sequelize.define('announcement',{
   aID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    aTitle: {
       type:Sequelize.STRING(100), 
       allowNull: false,
    },
    aContents: {
       type:Sequelize.TEXT, 
       allowNull: false,
    },
    aTime: {
       type:Sequelize.DATE, 
       allowNull: false,
    },
    aClickCount: {
        type:Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
     },
},{
    timestamps: false, // 不要默认时间戳 数据库没有时间戳字段时，设置为false，否则报错  SequelizeDatabaseError: Unknown column 'createdAt' in 'field list'
    freezeTableName: true 
});

module.exports = announcement;