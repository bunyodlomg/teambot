const { bot } = require("../bot");
const btn = require('../keyboard/admin_keyboard/buttons');
const kb = require('../keyboard/admin_keyboard/keyboard');
const { listWorkers } = require("./listWorkers");

let back = '',
    check_input = {};
const forAdmin = async (ctx, text, admin) => {
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

        default:
            break;
    }
}
module.exports = { forAdmin }