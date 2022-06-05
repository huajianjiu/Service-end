var express = require('express');
var router = express.Router();
const topic = require('../../db/model/topic');
const section = require('../../db/model/section');
const user = require('../../db/model/user');
const imglist = require('../../db/model/imglist');
const reply = require('../../db/model/reply');
const {
	Op
} = require("sequelize");
// 引入响应对象
const {
	resSuccess,
	resError400
} = require('../../utils/response');

// 查询|搜索帖子列表
router.get('/topicList', async (req, res) => {
	let {
		page,
		limit,
		sName,
		userNickname,
		tStatus
	} = req.query;
	// 定义返回数据对象
	let resData = {
		...resSuccess
	};
	// 定义where对象
	let swhere, uwhere;
	if (userNickname != '' || sName != '') {
		// 判断最终填入where语句的数据
		if (userNickname == '') {
			swhere = {
				sName
			};
			uwhere = '';
		} else if (sName == '') {
			swhere = '';
			uwhere = {
				userNickname: {
					[Op.substring]: userNickname
				}
			};
		} else { //都不为空
			swhere = {
				sName
			};
			uwhere = {
				userNickname: {
					[Op.substring]: userNickname
				}
			};
		}
	} else {
		swhere = '';
		uwhere = '';
	}
	// 绑定数据库一对多关系
	section.hasMany(topic);
	topic.belongsTo(section);
	user.hasMany(topic);
	topic.belongsTo(user);
	// topic.hasMany(imglist);
	// imglist.belongsTo(topic);
	let data = await topic.findAndCountAll({
		attributes: ['tID', 'tReplyCount', 'tClickCount', 'tLike', 'tTime', 'tTitle','tContents'],
		include: [{
				model: section,
				attributes: ['sName'],
				where: swhere
			},
			{
				model: user,
				attributes: ['userNickname'],
				where: uwhere
			},
		],
		where: {
			tStatus
		},
		offset: (page - 1) * limit,
		limit: limit * 1,
	})
	resData.data = data;
	res.send(resData)
})
// 通过帖子
router.put('/passTopic',async(req,res)=>{
	const {tID} = req.body;
	await topic.update({tStatus:1},{where:{tID}});
	res.send(resSuccess);
})
// 删除帖子
router.delete('/deleteTopic',async(req,res)=>{
	const {tID} = req.body;
	await topic.destroy({where: {tID}});
	// 删除所属
	await reply.destroy({where:{topicPID:tID}});
	res.send(resSuccess);
})
// 获取下拉菜单数据
router.get('/selectList',async(req,res)=>{
	let result = await section.findAll({attributes:['sID','sName'],raw:true});
	let resData={...resSuccess};
	resData.data=result;
	res.send(resData);
})

// 获取帖子图片
router.get('/imgList',async(req,res)=>{
	const {tID} = req.query;
	let result = await imglist.findAll({where: {topicTID:tID},raw:true})
	let data = {...resSuccess};
	data.data=result;
	res.send(data);
})
// 获取评论
router.get('/replyList',async(req,res)=>{
	const {tID,page,limit}=req.query;
	// 绑定数据库一对多关系
	user.hasMany(reply);
	reply.belongsTo(user);
	let result = await reply.findAndCountAll({
		attributes: ['rID', 'rContents'],
		include: [{
				model: user,
				attributes: ['userNickname','userAvatarUrl'],
			},
		],
		where: {
			topicPID:tID
		},
		offset: (page - 1) * limit,
		limit: limit * 1,
	})
	let data = {...resSuccess};
	data.data=result;
	res.send(data);
})

// 删除评论
router.delete('/deleteReply',async(req,res)=>{
	const {rID} = req.body;
	await reply.destroy({where:{rID}});
	res.send(resSuccess);
})
module.exports = router;
