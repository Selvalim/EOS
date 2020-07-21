const router = require('koa-router')()
// 引入mongo模型
const Person = require('../dbs/models/test')

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})
router.get('/find', async (ctx, next) => {
  await ctx.render('find', {
    title: 'Hello Koa 2!'
  })
})
router.get('/add', async (ctx, next) => {
  await ctx.render('add', {
    title: 'Hello Koa 2!'
  })
})

/**
 *  一、 增加 内容 向person数据模型中
 *
 *     可以通过命令行执行：curl -d 'name=cck&age=27' http://localhost:3000/users/addPerson
 *     若返回: {
                "code": 0
              }
       证明添加数据成功。

       注意： save()方法是model自带的写入数据的方法, 通过实例 person 写入
 */

router.post('/addPerson', async function (ctx) {
  // 创建实例
  const person = new Person({
    name: ctx.request.body.name,
    age: ctx.request.body.age
  })

  let code = 0 // 状态码

  try {
    await person.save()
    code = 0
  } catch(e) {
    code = -1
  }

  // 返回状态（成功为0， 错误为-1）
  ctx.body = {
    code
  }
})

/**
 *  二、 读取 内容 从person数据模型中
 *      命令行中输入：curl -d 'name=cck' http://localhost:3000/users/getPerson
 *      返回：{
                "code": 0,
                "result": {
                  "_id": "5beb91bcd6e7060ffcca6a46",
                  "name": "cck",
                  "age": 27,
                  "__v": 0
                },
                "results": [
                  {
                    "_id": "5beb91bcd6e7060ffcca6a46",
                    "name": "cck",
                    "age": 27,
                    "__v": 0
                  }
                ]
              }
 *
 *    注意： findOne()和find()方法是model自带的读取数据的方法, 注意：这里直接通过模型 Person 写入 ！！！
 *          findOne() 只是找到一条符合条件的内容
 *          find() 可以找到整个符合条件的集合(数组)
 */

router.post('/getPerson', async function (ctx) {
  const result = await Person.findOne({
    name: ctx.request.body.name
  })

  const results = await Person.find({
    name: ctx.request.body.name
  })

  // 这里没有考虑异常，直接返回了结果
  ctx.body = {
    code: 0,
    result,
    results
  }
})

/**
 *  三、 修改 内容 从person数据模型中
 *      命令行中输入：curl -d 'name=wy&age=19' http://localhost:3000/users/updatePerson
 *      返回：{
                "code": 0,
              }
 *
 *    注意： where()和update()方法是model自带的读取数据的方法, 注意：这里直接通过模型 Person 写入 ！！！
 *          where() 找到符合条件的内容
 *          update() 修改该内容
 */

router.post('/updatePerson', async function (ctx) {
  // 找到符合条件的name,并修改其age
  const result = await Person.where({
    name: ctx.request.body.name
  }).update({
    age: ctx.request.body.age
  })

  // 这里没有考虑异常，直接返回了结果
  ctx.body = {
    code: 0
  }
})

/**
 *  四、 删除 内容 从person数据模型中
 *
 *    注意： where()和update()方法是model自带的读取数据的方法, 注意：这里直接通过模型 Person 写入 ！！！
 *          where() 找到符合条件的内容
 *          remove() 删除该内容
 */

router.post('/removePerson', async function (ctx) {
  // 找到符合条件的name,并修改其age
  const result = await Person.where({
    name: ctx.request.body.name
  }).remove()

  // 这里没有考虑异常，直接返回了结果
  ctx.body = {
    code: 0
  }
})

module.exports = router