const { Bot, GrammyError, HttpError } = require('grammy');
const { User } = require('../models/model');
const { tasksSend } = require('./admin/tasksSend');
require('dotenv').config()
const bot = new Bot(process.env.TOKEN)

let users = [],
    usersId = [],
    len = 0;

bot.on('callback_query:data', async ctx => {
    if (ctx.callbackQuery.data !== 'select') {
        const user = await User.findOne({ id: ctx.callbackQuery.data });
        const full_name = user.first_name + ' ' + user.last_name;
        if (users.includes(full_name)) {
            const index = users.indexOf(full_name);
            const indexId = usersId.indexOf(user.id);
            users.splice(index, 1);
            usersId.splice(indexId, 1);
        } else {
            users.push(full_name);
            usersId.push(user.id);
            len += 1;
        }
        const newContent = users.join('\n');
        ctx.answerCallbackQuery({ text: newContent, show_alert: true });
    } else if (ctx.callbackQuery.data === 'select') {
        tasksSend(ctx, usersId)
    }
})
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

module.exports = { bot };

require('./message')