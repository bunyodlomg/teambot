const btn = require("../keyboard/user_keyboard/buttons");
const kb = require('../keyboard/user_keyboard/keyboard');
const { workStart } = require("./workStart");
const { workEnd } = require("./workEnd");
const { backUser } = require("./back");
const { workDescription } = require("./workDescription");
const { reason } = require("../helper/reason");
const { usersQueue } = require("./usersQueue");

let back = '',
    check_input = {};

const forUser = async (ctx, text, user) => {
    const id = ctx.from.id
    switch (text) {
        case '/start':
            check_input = {};
            await ctx.reply(`Assalomu alaykum ${user.first_name + ' ' + user.last_name}! \nQuyidagi bo'limlardan birini tanlang 👇`, {
                reply_markup: {
                    keyboard: kb.home
                }
            })
            back = ''
            break;
        case btn.home.today:
            check_input = {};
            await ctx.reply(`Kerakli bo'limni tanlang 👇`, {
                reply_markup: {
                    keyboard: kb.today
                }
            })
            back = 'home'
            break;
        case btn.today.start:
            check_input = {};
            workStart(ctx, user, id)
            back = 'today'
            break;
        case btn.today.end:
            check_input = {};
            workEnd(ctx, id)
            back = 'today'
            break;
        case btn.today.late:
            check_input = { type: 'late', value: ctx.msgId, text: ctx.message.text }
            reason(ctx, id)
            back = 'today'
            break;
        case btn.today.not_start:
            check_input = { type: 'not_start', value: ctx.msgId, text: ctx.message.text }
            reason(ctx, id)
            back = 'today'
            break;
        case btn.today.queue:
            check_input = {};
            usersQueue(ctx)
            back = 'today'
            break;
        case 'Ortga qaytish 🔙':
            check_input = {};
            backUser(ctx, user, back)
            break;
        default:
            if (check_input !== '{}' && check_input.value == ctx.msgId - 2) {
                workDescription(ctx, id, check_input.type, check_input.text)
            }
            break;
    }
}

module.exports = { forUser }