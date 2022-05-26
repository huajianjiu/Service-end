// 封装服务器响应数据
/*常用状态码记忆
200：请求成功（后台处理结果ok）
303：重定向
400：请求错误
401：未授权
403：禁止访问
404：文件未找到
500：服务器错误*/
// 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
module.exports = {
    resSuccess:{
        code:200,
        message: "success",
        data: {}
    },
    resError400: {
        code:400,
        message: "请求参数错误",
        data:null
    }
}