const { bot } = require("../bot");
const btn = require('../keyboard/admin_keyboard/buttons');
const kb = require('../keyboard/admin_keyboard/keyboard');
const { listWorkers } = require("./listWorkers");
const { tasks } = require("./tasksView");

let back = '',
    check_input = {};
const forAdmin = async (ctx, text) => {
    switch (text) {
        case '/start':
            ctx.reply(`Assalomu alaykum Admin🌟.`, {
                reply_markup: {
                    keyboard: kb.home,
                    resize_keyboard: true
                }
            })
            break;
        case btn.home.workers:
            listWorkers(ctx)
            break;
        case btn.home.tasks:
            console.log(ctx.msgId);
            tasks(ctx)
            break;
        default:
            break;
    }
}
module.exports = { forAdmin }