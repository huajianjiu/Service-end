var express = require('express');
var router = express.Router();
const admin = require('../../db/model/admin');
// 引入token
const {generateToken} = require('../../utils/token')
// 引入响应对象
const {resSuccess,resError400} = require('../../utils/response');
// 登录接口
router.post('/login', async(req, res)=> {
    try {
        const username=req.body.username,
        password = req.body.password;
        let result=await admin.findAll({
            attributes:['adminPassword'],
            where: {
                adminName:username
            },
            raw:true,
        })
		// 是否有数据
		if (result.length >= 1) {
			if(password==result[0].adminPassword){
				let data={...resSuccess};
				data.data.token=generateToken({username},'1h');
				res.send(data);
			}else{
				res.json({
					code:201,
					message: "账号或密码错误",
					data:null
				})
			}	
		}else{
			res.json({
				code:201,
				message: "账号错误或不存在",
				data:null
			})
		}
    } catch (error) {
        console.log(error)
    }
});
// 获取用户信息接口
router.get('/info',(req,res)=>{
    let data={...resSuccess};
    data.data=req.auth;
    res.send(data);
})

module.exports = router;
