const { Bot } = require('grammy');
require('dotenv').config()
const bot = new Bot(process.env.TOKEN)
let queue = 0,
    queueDate = '2024-05-11';
bot.start();



module.exports = { bot, queue, queueDate };
require('./message')