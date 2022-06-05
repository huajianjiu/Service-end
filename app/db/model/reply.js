/**
 * 评论信息
 */

var Sequelize = require('sequelize');
var {
	sequelize
} = require('../sequelize.js');

var reply = sequelize.define('reply', {
	rID: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true
	},
	topicPID: {//sectionSID
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	userUID: {//userUID
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	rContents: {
		type: Sequelize.STRING(200),
		allowNull: false,
	},
	rTime: {
		type: Sequelize.DATE,
		allowNull: false,
	},
	rLikes: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0
	},
}, {
	timestamps: false, // 不要默认时间戳 数据库没有时间戳字段时，设置为false，否则报错  SequelizeDatabaseError: Unknown column 'createdAt' in 'field list'
	freezeTableName: true
});

module.exports = reply;