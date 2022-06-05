var express = require('express');
var router = express.Router();
const user = require('../../db/model/user');
const reply = require('../../db/model/reply');
const Email = require('../../db/model/email');
const nodemailer = require('nodemailer');
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
			attributes: ['userPassword', 'uID', 'userStatus'],
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
					let resData = {
						...resError400
					};
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
router.get('/userInfo', async (req, res) => {
	let data = {
		...resSuccess
	};
	try {
		const uID = req.auth.uID
		let result = await user.findAll({
			attributes: ['uID', 'userName', 'userNickname', 'userBirthday',
				'userGender', 'userStatement', 'userAvatarUrl'
			],
			where: {
				uID
			},
			raw: true,
		})
		data.data = result;
		res.send(data);

	} catch (e) {
		//TODO handle the exception
		res.json({
			code: 50014,
			message: "登录过期",
			data: null,
		})
	}

})
// 获取回复数量
router.get('/replyCount', async (req, res) => {
	const uID = req.query.uID;
	let result = await reply.count({
		where: {
			userUID: uID
		}
	})
	let data = {
		...resSuccess
	};
	data.data.replyCount = result;
	res.send(data);
})
// 修改用户信息
router.put('/editUserInfo', async (req, res) => {
	const {
		uID,
		userAvatarUrl,
		userBirthday,
		userGender,
		userNickname,
		userStatement
	} = req.body;
	await user.update({
		userAvatarUrl,
		userBirthday,
		userGender,
		userNickname,
		userStatement
	}, {
		where: {
			uID
		}
	});
	res.send(resSuccess);
})
// 校验账号是否存在
router.get('/validatorUsername', async (req, res) => {
	const {
		username
	} = req.query;
	let result = await user.count({
		where: {
			userName: username
		}
	})
	result > 0 ? res.send(resError400) : res.send(resSuccess);
})
// 注册账号
router.post('/register', async (req, res) => {
	console.log(req.body)
	const {
		username,
		password
	} = req.body;
	const userRegDate = moment().format('YYYY-MM-DD HH:mm:ss');
	let result = await user.create({
		userName: username,
		userPassword: password,
		userRegDate
	});
	let data = {
		...resSuccess
	};
	result = JSON.parse(JSON.stringify(result))
	const uID = result.uID
	data.data.token = generateToken({
		uID,
	}, '1y');
	res.send(data);
})
// 发送验证码
router.get('/getCode', (req, res) => {
	let {
		email
	} = req.query
	let code = '';
	for (let i = 0; i < 6; i++) {
		code += Math.floor(Math.random() * 10);
	}
	// 建立一个smtp连接
	let transporter = nodemailer.createTransport({
		host: 'smtp.qq.com',
		secureConnection: true,
		port: 465,
		auth: {
			user: 'xxx@qq.com',//自己的邮箱地址
			pass: 'xxxxxxxx'// smtp码，去邮箱获取
		}
	})
	// 配置相关参数
	let options = {
		from: '',//自己的邮箱地址
		to: email,//目标邮箱地址
		subject: '验证你的电子邮箱',
		html: `
	  <p>你好！</p>
	  <p>您正在注册校园论坛账号</p>
	  <p>你的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
	  `
	}
	transporter.sendMail(options, async (err, msg) => {
		if (err) {
			transporter.close();
			console.log(err);
			return res.send(resError400);

		}
		if (await Email.findOne({
				where: {
					email
				},
				raw: true
			}) === null) {
			await Email.create({
				email,
				code
			});
		} else {
			await Email.update({
				code
			}, {
				where: {
					email
				}
			});
		}
		res.send(resSuccess);
		transporter.close();
	})
});
//   校验验证码
router.post('/checkCode', async (req, res) => {
	try {
		const {
			email,
			code
		} = req.body;
		const scode = await Email.findOne({
			attributes: ['email', 'code'],
			where: {
				email
			},
			raw: true
		});
		// console.log(scode.code);
		if (code == scode.code) {
			await Email.destroy({
				where: {
					email
				}
			})
			res.send(resSuccess);
		} else {
			res.json({
				code: 201,
				meaasge: "验证码错误",
				data: null
			});
		}
	} catch (error) {
		res.json({
			code: 201,
			meaasge: "验证码已过期，请重新获取",
			data: null
		});
	}

})
// 修改密码
router.put('/editPwd', async (req, res) => {
	try {
		const {
			userName,
			oldPassword,
			userPassword
		} = req.body;
		let data=await user.findOne({
			attributes: ['userPassword'],
				where: {
					userName
				},
				raw: true
			})
			console.log(data);
			console.log(data.userPassword);
		if (data.userPassword == oldPassword) {
			await user.update({
				userPassword
			}, {
				where: {
					userName
				}
			});
			res.send(resSuccess);
		} else {
			res.json({
				code: 201,
				message: '旧密码错误，请重新输入',
				data: null
			})
		}
	} catch (error) {
		console.log(error)
		res.json({
			code: 201,
			message: '修改失败，请稍后重试',
			data: null
		})
	}

})
module.exports = router;