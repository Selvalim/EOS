const mongoose = require('mongoose')

// 创建数据表模型，该文件的名字，即rank，就是数据表的名字
// 下面给 rank 表声明所有字段

let rankSchema = new mongoose.Schema({
    account: String,
    account0: String,
    version: String,
    time: String,
    votes: String,
    voters: String,
    percent: String,
    reward: String,
    state: Number,
    down_pay: Number,
    up_pay: Number,
    date: Array
})

// 通过建 model 给 rank 赋予增删改查等读写的功能
module.exports = mongoose.model('rank', rankSchema);