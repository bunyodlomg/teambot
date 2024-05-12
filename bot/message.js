const { bot } = require('./bot');
const { dateFormat } = require('./helper/dateFormat');
const { start } = require('./helper/start');

bot.on('message', async ctx => {
    const text = ctx.message.text;
    start(ctx, text)
})

bot.api.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "help", description: "Show help text" },
    { command: "settings", description: "Open settings" },
]);