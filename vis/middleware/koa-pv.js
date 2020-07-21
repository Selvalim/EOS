// 自定义中间件 koa-pv

function pv (ctx) {
    global.console.log('当前路由', ctx.path) // 打印当前路由，node中全局不能用window，需要用global代替
}

module.exports = function () {
    return async function(ctx, next) {
        pv(ctx);
        await next(); // 每个中间件都必须有这一句，用以执行下一个中间件
    }
}