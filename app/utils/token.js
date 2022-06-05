const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");
// 定义secret秘钥
const secretKey = "AynuSchoolofSoftware";
module.exports = {
    // 加密生成token
    generateToken:(data,time)=>{
        return jwt.sign(data,secretKey,{expiresIn:time});
    },
    // 解密token
    decodeToken:()=>expressjwt({secret:secretKey,algorithms: ["HS256"],credentialsRequired: false}).unless({path:['/admin/user/login','/app/user/login','/app/user/validatorUsername','/app/user/checkCode','/app/user/getCode']})
}