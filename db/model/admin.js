/**
 * 管理员信息
 */

 var Sequelize = require('sequelize');
 var {sequelize} = require('../sequelize.js');
 
 var admin = sequelize.define('admin',{
    adminID: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         allowNull: false,
         autoIncrement: true
     },
     adminName: {
        type:Sequelize.STRING(15), 
        allowNull: false,
     },
     adminPassword: {
        type:Sequelize.STRING(15), 
        allowNull: false,
     },
 },{
     timestamps: false, // 不要默认时间戳 数据库没有时间戳字段时，设置为false，否则报错  SequelizeDatabaseError: Unknown column 'createdAt' in 'field list'
     freezeTableName: true 
 });
 
 module.exports = admin;
