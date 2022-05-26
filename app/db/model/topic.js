/**
 * 管理员信息
 */

var Sequelize = require('sequelize');
var {
	sequelize
} = require('../sequelize.js');

var topic = sequelize.define('topic', {
	tID: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		allowNull: false,
		autoIncrement: true
	},
	sectionSID: {//sectionSID
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	userUID: {//userUID
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	tStatus: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0
	},
	tReplyCount: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0
	},
	tTitle: {
		type: Sequelize.STRING(40),
		allowNull: false,
	},
	tContents: {
		type: Sequelize.STRING(2000),
	},
	tTime: {
		type: Sequelize.DATE,
		allowNull: false,
	},
	tClickCount: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0
	},
	tCoverURL: {
		type: Sequelize.STRING(100),
	},
	tLike: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0
	},
}, {
	timestamps: false, // 不要默认时间戳 数据库没有时间戳字段时，设置为false，否则报错  SequelizeDatabaseError: Unknown column 'createdAt' in 'field list'
	freezeTableName: true
});

module.exports = topic;
