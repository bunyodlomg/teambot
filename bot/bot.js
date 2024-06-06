const { Bot, GrammyError, HttpError } = require('grammy');
require('dotenv').config()
const bot = new Bot(process.env.TOKEN)

let usersId = [],
    userList = []
list = ``;


bot.on('callback_query:data', async (ctx) => {
    const callbackData = ctx.callbackQuery.data;

    if (callbackData.startsWith('music_search_')) {
        const lyricId = callbackData.split('_')[2];
        const lyric = await Lyric.findById(lyricId);
        if (lyric) {
            await ctx.api.sendMessage(ctx.from.id,
                `${lyric.title}\n\n${lyric.text}`, {
                parse_mode: 'HTML'
            });
        }
    } else if (callbackData.startsWith('ms_right_') || callbackData.startsWith('ms_left_')) {
        const text = callbackData.split('_')[2];
        const skip = parseInt(callbackData.split('_')[3]);
        searchLyric(ctx,text,skip,10)
        ctx.deleteMessage()
    }

    await ctx.answerCallbackQuery(); // Acknowledge the callback query
});


bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`); const e = err.error;
    if (e instanceof GrammyError) {
        console.error('Error in request:', e.description);
    } else if (e instanceof HttpError) {
        console.error('Could not contact Telegram:', e);
    } else {
        console.error('Unknown error:', e);
    }
});

bot.start();


module.exports = { bot }

require('./message')
const {Lyric} = require("../models/model");
const {searchLyric} = require("./user/user");