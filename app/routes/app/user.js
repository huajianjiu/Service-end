var express = require('express');
var router = express.Router();
const user = require('../../db/model/user');
const reply = require('../../db/model/reply');
const moment = require('moment')
// 引入token
const {
	generateToken
} = require('../../utils/token')
// 引入响应对象
const {
	resSuccess,
	resError400
} = require('../../utils/response');
// 登录接口
router.post('/login', async (req, res) => {
	try {
		const username = req.body.username,
			password = req.body.password;
		let result = await user.findAll({
			attributes: ['userPassword','uID','userStatus'
			],
			where: {
				userName: username
			},
			raw: true,
		})
		// 是否有数据
		if (result.length >= 1) {
			if (password == result[0].userPassword) {
					
				if (result[0].userStatus == 0) {
					let userName = username;
					let data = {
						...resSuccess
					};
					const {
						uID
					} = result[0];
					data.data.token = generateToken({
						uID,
					}, '1y');
					res.send(data);
				} else {
					let resData = resError400;
					resData.code = 400;
					resData.message = "您的账号已被封禁",
						res.send(resData);
				}
			} else {
				res.json({
					code: 401,
					message: "密码错误",
					data: null
				})
			}
		} else {
			res.json({
				code: 401,
				message: "账号错误或不存在",
				data: null
			})
		}
	} catch (error) {
		console.log(error)
	}
});
// 获取用户信息接口
router.get('/userInfo', async(req, res) => {
	let data = {
		...resSuccess
	};
	try{
		const uID = req.auth.uID
		let result = await user.findAll({
			attributes: ['uID','userName' ,'userNickname', 'userBirthday',
				'userGender', 'userStatement', 'userAvatarUrl'
			],
			where: {
				uID
			},
			raw: true,
		})
		data.data = result;
		res.send(data);
		
	}catch(e){
		//TODO handle the exception
	res.json({
	  code:50014,
	  message: "登录过期",
	  data:null,
	})
	}

})
// 获取回复数量
router.get('/replyCount',async(req,res)=>{
	const uID = req.query.uID;
	let result = await reply.count({where:{userUID:uID}})
	let data = {
		...resSuccess
	};
	data.data.replyCount=result;
	res.send(data);
})
// 修改用户信息
router.put('/editUserInfo',async(req,res)=>{
	const {uID,userAvatarUrl,userBirthday,userGender,userNickname,userStatement}=req.body;
	await user.update({userAvatarUrl,userBirthday,userGender,userNickname,userStatement},{where:{uID}});
	res.send(resSuccess);
})
// 校验账号是否存在
router.get('/validatorUsername',async(req,res)=>{
	const {username} = req.query;
	let result = await user.count({where:{userName:username}})
	result>0?res.send(resError400):res.send(resSuccess);
})
// 注册账号
router.post('/register',async(req,res)=>{
	console.log(req.body)
	const {username,password} = req.body;
	const userRegDate = moment().format('YYYY-MM-DD HH:mm:ss');
	let result = await user.create({userName:username,userPassword:password,userRegDate});
	let data = {...resSuccess};
	result = JSON.parse(JSON.stringify(result))
	const uID=result.uID
	data.data.token = generateToken({
		uID,
	}, '1y');
	res.send(data);
})
module.exports = router;
