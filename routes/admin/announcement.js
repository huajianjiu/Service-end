var express = require('express');
var router = express.Router();
const moment = require('moment');
const announcement = require('../../db/model/announcement');
// 引入响应对象
const {resSuccess,resError400} = require('../../utils/response');

// 获取所有公告
router.get('/announcementList',async(req,res)=>{
    // 深拷贝响应对象
    let data={...resSuccess};
    data.data = await announcement.findAll({raw:true,order:[['aID','DESC']]});
    res.send(data);
})
// 添加|修改公告
router.post('/addOrUpdateAnnouncement',async(req,res)=>{
    // 结构数据
    const {aID,aTitle,aContents}=req.body;
    // 获取当前时间
    let aTime=moment().format('YYYY-MM-DD HH:mm:ss');
    // 深拷贝数据对象
    let data={...resSuccess};
    if(aID==''){
        await announcement.create({aTitle,aContents,aTime});
        data.message="发布成功"
    }else {
        await announcement.update({aTitle,aContents},{where:{aID}});
        data.message="修改成功"
    }
    res.send(data);
})
// 删除公告
router.delete('/delAnnouncement',async(req,res)=>{
    const aID = req.body.aID;
    try {
        await announcement.destroy({where: {aID}});
        res.send(resSuccess);
    } catch (error) {
        console.log(error);
    }
})
module.exports = router;