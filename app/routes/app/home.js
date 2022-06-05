var express = require('express');
const sequelize = require('sequelize');
var router = express.Router();
const user = require('../../db/model/user');
const reply = require('../../db/model/reply');
const section = require('../../db/model/section');
const topic = require('../../db/model/topic');
const imglist= require('../../db/model/imglist');
const moment = require('moment');
const announcement = require('../../db/model/announcement');
// 引入响应对象
const {
	resSuccess,
	resError400
} = require('../../utils/response');
// 获取板块数据
router.get('/sectionList',async(req,res)=>{
	console.log("进入")
    try {
        let result = await section.findAll({order:[['sID', 'ASC']],attributes: ['sID','sName'], raw: true,});
        let data={...resSuccess};
        data.data=result;
        res.send(data);
    }catch(err){
        console.log(err);
    }
})

// 获取帖子列表
router.get('/topicList', async(req, res) => {
	let {
		page,
		limit,
		sID,
		uID
	} = req.query;
	// 定义返回数据对象
	let resData = {
		...resSuccess
	};
	let whereData={}
	if(sID!=''){
		whereData={sectionSID:sID}
	}else{
		whereData={userUID:uID}
	}
	// 绑定数据库一对多关系
	user.hasMany(topic);
	topic.belongsTo(user);
	let data = await topic.findAndCountAll({
		attributes: ['tID', 'tReplyCount', 'tLike', 'tTitle','tContents','tCoverURL','tTime'],
		order:[['tID','DESC']],
		include: [
			{
				model: user,
				attributes: ['uID','userNickname','userAvatarUrl'],
			},
		],
		where: whereData,
		offset: (page - 1) * limit,
		limit: limit * 1,
	})
	resData.data = data;
	res.send(resData)
})
// 查询帖子图片
router.get('/imgList',async(req,res)=>{
	try{
	const {tID} = req.query;
	let result = await imglist.findAll({attributes:['imgURL'],where:{topicTID:tID},raw: true})
	await topic.increment({tClickCount: 1}, { where: { tID } })
	const{sectionSID}=await topic.findOne({attributes:['sectionSID'],where:{tID},raw:true});
	await section.increment({sClickCount: 1}, { where: { sID:sectionSID } })
	let data={...resSuccess};
	data.data=result;
	res.send(data);	
	}catch(e){
		console.log(e)
		res.send(resError400)
	}
})
// 查询帖子列表
router.get('/topicList', async(req, res) => {
	let {
		page,
		limit,
		sID
	} = req.query;
	// 定义返回数据对象
	let resData = {
		...resSuccess
	};
	// 绑定数据库一对多关系
	user.hasMany(topic);
	topic.belongsTo(user);
	let data = await topic.findAndCountAll({
		attributes: ['tID', 'tReplyCount', 'tLike', 'tTitle','tContents','tCoverURL','tTime'],
		order:[['tID','DESC']],
		include: [
			{
				model: user,
				attributes: ['uID','userNickname','userAvatarUrl'],
			},
		],
		where: {
			sectionSID:sID
		},
		offset: (page - 1) * limit,
		limit: limit * 1,
	})
	resData.data = data;
	res.send(resData)
})
// 发帖
router.post('/postTopic',async(req,res)=>{
	try{
		let {topicForm,imgList} = req.body;
		topicForm.tTime=moment().format('YYYY-MM-DD HH:mm:ss');
		let result= await topic.create(topicForm);
		result = JSON.parse(JSON.stringify(result))
		const topicTID=result.tID;
		if(imgList.length>0){
			for(let j=0;j<imgList.length;j++){
				await imglist.create({topicTID,imgURL:imgList[j]});
			}	
		}
		await section.increment({sTopicCount: 1}, { where: { sID: topicForm.sectionSID } })
		res.send(resSuccess);
	}catch(e){
		console.log(e)
		res.send(resError400);
	}
})
// 获取系统公告
router.get('/announcement',async(req,res)=>{
	let result = await announcement.findOne({order:[['aID','DESC']]})
	// 阅读加一
	await announcement.increment({aClickCount: 1}, { where: { aID: result.aID } })
	let data = {...resSuccess};
	data.data=result;
	res.send(data);
})
// 获取评论信息
router.get('/replyList', async(req, res) => {
	const {
		page,
		limit,
		tID
	} = req.query;
	// 定义返回数据对象
	let resData = {
		...resSuccess
	};
	// 绑定数据库一对多关系
	user.hasMany(reply);
	reply.belongsTo(user);
	let data = await reply.findAndCountAll({
		attributes: ['rID', 'rLikes','rContents','rTime'],
		order:[['rID','DESC']],
		include: [
			{
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
	resData.data = data;
	res.send(resData)
})
// 评论帖子
router.post('/sendReply',async(req,res)=>{
	let data=req.body;
	data.rTime=moment().format('YYYY-MM-DD HH:mm:ss');
	await reply.create(data);
	await topic.increment({tReplyCount: 1}, { where: { tID:data.topicPID}})
	res.send(resSuccess);
})
// 点赞评论
router.post('/likeReply',async(req,res)=>{
	const {rID,like}=req.body;
	await reply.increment({rLikes: like}, { where: { rID} })
	res.send(resSuccess);
})
// 点赞帖子
router.post('/likeTopic',async(req,res)=>{
	try{
	const {tID,like}=req.body;
		await topic.increment({tLike: like}, { where: { tID} })
	res.send(resSuccess);
		
	}catch(e){
		//TODO handle the exception
		console.log(e)
	}
})
// 删除帖子
router.delete('/deleteTopic',async(req,res)=>{
	try{
	const {tID}=req.body;
	await topic.destroy({ where: { tID} })
	res.send(resSuccess);
	}catch(e){
		//TODO handle the exception
		console.log(e)
	}
})
module.exports = router;