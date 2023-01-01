// 板块表模型
 var Sequelize = require('sequelize');
 var {sequelize} = require('../sequelize.js');
 
 var section = sequelize.define('section',{
    sID: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         allowNull: false,
         autoIncrement: true
     },
     sName: {
        type:Sequelize.STRING(15), 
        allowNull: false,
     },
     sStatement: {
        type:Sequelize.STRING(500), 
        allowNull: false,
     },
     sClickCount: {
        type:Sequelize.INTEGER(11), 
        allowNull: false,
        defaultValue:0
     },
     sTopicCount: {
        type:Sequelize.INTEGER(11), 
        allowNull: false,
        defaultValue: 0
     },
 },{
     timestamps: false, // 不要默认时间戳 数据库没有时间戳字段时，设置为false，否则报错  SequelizeDatabaseError: Unknown column 'createdAt' in 'field list'
     freezeTableName: true 
 });
 
 module.exports = section;