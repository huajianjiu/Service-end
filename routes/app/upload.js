const express = require('express');
const router = express.Router();
const multer = require('multer');
var fs = require("fs");
const { resSuccess } = require('../../utils/response');
const random = require('string-random');
router.post("/avatar", multer({
    dest: "./public/upload/avatar"
}).single("avatar"), (req, res) => {
    var url = "http://localhost:3003/";
    var file = req.file;
    var time = Date.now();
    try {
        var name=file.originalname.split('.')
        name = "."+name[name.length - 1];
        fs.renameSync(file.path, `./public/upload/avatar/${time+name}`)
        file.path = url + `upload/avatar/${time+name}`;
        res.json({
			code:200,
			message:"success",
			data:{"url":file.path}}
		);
    } catch (e) {
        console.log(e)
    }
})
// 多个文件上传
router.post('/pictures', multer({dest:'./public/upload/pictures'}).array('pictures',6), async(req, res) => {
	try{
    const files=req.files;
	let imglist=[];
	var url = "http://localhost:3003/";
	for(let i in files){
		let strName = random(16);
		let file = files[i]
		// console.log(file)
		var name=file.originalname.split('.')
		name = "."+name[name.length - 1];
		await fs.renameSync(file.path,`./public/upload/pictures/${strName+name}`);
		file.path = url + `upload/pictures/${strName+name}`;
		// console.log(file.path);
		imglist.push(file.path);
	}
	let data = {...resSuccess};
	data.data=imglist;
	res.send(data);
		
	}catch(e){
		//TODO handle the exception
		console.log(e)
	}
});
 
module.exports = router;
