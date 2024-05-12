const { bot } = require('./bot');
const { start } = require('./helper/start');

bot.on('message', async ctx => {
    const text = ctx.message.text;
    start(ctx, text)
})

bot.api.setMyCommands([
    { command: "start", description: "Botni ishga tushirish" },
    { command: "help", description: "Yordam" },
]);