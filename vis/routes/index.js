const router = require('koa-router')()
//引入mongo模型
const Rank = require('../dbs/models/rank')
const moment=require("moment")


router.get('/favicon.ico', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.post('/init', async (ctx, next) => {
  ctx.body = 'koa2 string'
  var ver=ctx.request.body.ver;
  var results=[];
  for(var i=0,len=ver.length;i<len;i++){
    results[i] = await Rank.find({
      version: ver[i]
    })
  }
  ctx.body={
    results,
  }
})
router.post('/api/init', async (ctx, next) => {
  var ver=JSON.parse(ctx.request.body.ver);
  var number=ctx.request.body.number
  var results=[];
  for(var i=0;i<number;i++){
    results[i] = await Rank.find({
      version: ver[i]
    })
  }
   ctx.response.body={
     ver,
    results,
  }
})
router.post('/api/setDate', async (ctx, next) => {
  var start=ctx.request.body.start;
  var sstart=start.year+"-"+start.month+"-"+start.day+""
  var mstart=moment(sstart)
  var end=ctx.request.body.end;
  var send=end.year+"-"+end.month+"-"+end.day+""
  var mend=moment(send).add(1,"day")
  console.log(start)
  console.log(end)
  var results={
  };
  results.start = await Rank.findOne({
      "date.0": parseFloat(mstart.year()),
      "date.1": parseFloat(mstart.month()),
      "date.2": parseFloat(mstart.date()),
    })
  while(true){
  if(!results.start){
    console.log("start null了")
    mstart=mstart.add(1,"d")
    console.log(mstart.date())
    results.start = await Rank.findOne({
      "date.0": parseFloat(mstart.year()),
      "date.1": parseFloat(mstart.month()),
      "date.2": parseFloat(mstart.date()),
    })
  }else{
    break;
  }
}
  results.end = await Rank.findOne({
    "date.0": parseFloat(mend.year()),
    "date.1": parseFloat(mend.month()),
    "date.2": parseFloat(mend.date()),
  })
  if(!results.end){
    console.log("end null了")
    mend=mend.subtract(1,"d")
    console.log(mend.date())
    results.start = await Rank.findOne({
      "date.0": parseFloat(mend.year()),
      "date.1": parseFloat(mend.month()),
      "date.2": parseFloat(mend.date()),
    })
  }
  await delayer(3000)
  console.log(results)
   ctx.response.body={
    start:results.start.version,
    end:results.end.version,
  }
})

router.get('/view1', async (ctx, next) => {
  const result = await Rank.findOne({
    version: '4'
  },function(err,result){
    if (err) return handleError(err);
    return result;
  })
  const results = await Rank.find({
    version: '4'
  })
  // 这里没有考虑异常，直接返回了结果
  ctx.body = {
    code: 0,
  }
  await ctx.render('view1', {
    title: 'Hello Koa 2!',
  })
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})
async function delayer(time = 2000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("延迟结束")
      resolve();
    }, time);
  });
}

module.exports = router
