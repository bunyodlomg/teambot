const { bot } = require('../bot');
const btn = require("../keyboard/user_keyboard/buttons");
const kb = require('../keyboard/user_keyboard/keyboard');
const { workStart } = require("./workDay/workStart");
const { workEnd } = require("./workDay/workEnd");
const { backUser } = require("./back");
const { workDescription } = require("./workDescription");
const { reason } = require("./reason");
const { usersQueue } = require("./workDay/usersQueue");
const { feedback } = require("./feedback/feedback");

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

        // TODAY START
        case btn.home.today:
            check_input = {};
            await ctx.reply(`Kerakli bo'limni tanlang 👇`, {
                reply_markup: {
                    keyboard: kb.today
                }
            })
            back = ''
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
            usersQueue(ctx)
            back = 'today'
            break;
        // TODAY END

        // FEEDBACK START
        case btn.home.feedback:
            await ctx.reply(`Taklif yoki shikoyatingizni yozib qoldirishingiz mumkun 📝`, {
                reply_markup: {
                    keyboard: kb.home,
                    one_time_keyboard: true,
                    input_field_placeholder: "Taklif yoki shikoyatingizni kiriting..."

                }
            })
            check_input = { type: 'feedback', value: ctx.msgId, text: ctx.message.text }
            back = ''
            break;
        // FEEDBACK END

        case btn.back:
            console.log('back clicked');
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