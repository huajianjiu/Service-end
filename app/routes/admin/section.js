var express = require('express');
var router = express.Router();
const section = require('../../db/model/section');
// 引入响应对象
const {resSuccess,resError400} = require('../../utils/response');

// 板块数据获取
router.get('/sectionList',async(req,res)=>{
    try {
        let result = await section.findAll({raw:true});
        let data={...resSuccess};
        data.data=result;
        res.send(data);
    }catch(err){
        console.log(err);
    }
})
// 添加|修改板块
router.post('/addOrUpdateSection',async(req,res)=>{
        const {sID,sName,sStatement}=req.body;
        // 深拷贝数据对象
        let data={...resSuccess};
        try {
        if(sID==''){
                await section.create({sName,sStatement});
                data.message="添加成功"
            }else {
                await section.update({sName,sStatement},{where:{sID}});
                data.message="修改成功"
            }
        } catch (error) {
            data.code=201;
            data.message="板块名已经存在";
        }
        res.send(data);
})
// 删除板块信息
router.delete('/delSection',async(req,res)=>{
    const sID = req.body.sID;
    try {
        await section.destroy({where: {sID}});
        res.send(resSuccess);
    } catch (error) {
        console.log(error);
    }
})
module.exports = router;