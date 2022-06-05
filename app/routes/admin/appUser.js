var express = require('express');
var router = express.Router();
const moment = require('moment');
const user = require('../../db/model/user');
const { Op } = require("sequelize");
// 引入响应对象
const {resSuccess,resError400} = require('../../utils/response');

// 查询|搜索用户列表
router.get('/userList',async(req,res)=>{
    const {page,limit,userNickname,userStatus} = req.query;
    // 获取数据总数
    let resData = {...resSuccess};
    let result;
    // 判断是查询还是搜索
    if(userNickname!=''||userStatus!=''){
        let data={};
        // 判断最终填入where语句的数据
        if(userNickname==""){
            data={userStatus}
        }else if(userStatus==""){
            data={userNickname:{[Op.substring]:userNickname}}
        }else{
            data={userNickname:{[Op.substring]:userNickname},userStatus};
        }
        resData.count=await user.count({where:data});
        result = await user.findAll({offset: (page-1)*limit, limit:limit*1,where:data,raw:true});
    }else{
        resData.count=await user.count({});
        result = await user.findAll({offset: (page-1)*limit, limit:limit*1,raw:true});
    }
    resData.data=result;
    res.send(resData);
})
// 添加编辑用户
router.post('/addOrUpdateUserInfo',async(req,res)=>{
    const {uID,userName,userPassword,userNickname,userEmail,userBirthday,userStatement,userGender} = req.body;
    let data={uID,userName,userPassword,userNickname,userEmail,userBirthday,userStatement,userGender};
	let resData={...resSuccess};
    // 移除空属性
    userEmail==""?delete data.userEmail:null;
    userBirthday==""?delete data.userBirthday:null;
    userStatement==""?delete data.userStatement:null;
    // 判断是添加|修改
    if(uID==''){
        // 创建用户信息
        // 移除空属性
        delete data.uID;
        // 添加必填项
        data.userAvatarUrl='/admin/images/default.png';
        data.userRegDate=moment().format('YYYY-MM-DD HH:mm:ss');
        // 操作数据库
        await user.create(data);
		resData.message="添加成功"
        res.send(resData);
    }else{
        // 移除uID
        delete data.uID;
        await user.update(data,{where:{uID}});
		resData.message="修改成功"
        res.send(resData);
    }
})
// 封禁用户
router.put('/banOrLetOfUser',async(req,res)=>{
	let {uID,userStatus}=req.body;
	userStatus=userStatus==0?1:0;
	let banBeginDate=userStatus==1?moment().format('YYYY-MM-DD HH:mm:ss'):null;
	let resData={...resSuccess};
	console.log(banBeginDate);
	await user.update({userStatus,banBeginDate},{where:{uID}});
	resData.message=userStatus==0?'解封成功':'封号成功'
	res.send(resData);
})

module.exports = router;
