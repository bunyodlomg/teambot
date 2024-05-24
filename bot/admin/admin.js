const { Tasks } = require('../../models/model');
const { dateFormat } = require('../helper/dateFormat');
const btn = require('../keyboard/admin_keyboard/buttons');
const kb = require('../keyboard/admin_keyboard/keyboard');
const { backAdmin } = require('./back');
const { listWorkers } = require("./listWorkers");
const { tasksView } = require("./tasksView");
const { AdminDescription } = require('./AdminDescription');
const { getHours, getMinutes } = require('date-fns');
const { viewFeedback } = require('./feedback');

let back = '',
    check_input = {};
const forAdmin = async (ctx, text, admin) => {
    switch (text) {
        case '/start':
            check_input = {}
            ctx.reply(`Assalomu alaykum Admin🌟.`, {
                reply_markup: {
                    keyboard: kb.home,
                    resize_keyboard: true
                }
            })
            back = ''
            break;
        case btn.home.workers:
            check_input = {};
            listWorkers(ctx, 'user');
            break;
        // TASKS START
        case btn.home.tasks:
            ctx.reply(`Kerakli bo'limni tanlang 👇`, {
                reply_markup: {
                    keyboard: kb.tasks,
                    resize_keyboard: true
                }
            })
            back = 'home'
            break;
        case btn.tasks.send:
            check_input = { type: 'send', value: ctx.msgId, text: ctx.message.text }
            ctx.reply('Vazifani kiriting ✍️')
            back = 'tasks'
            break;
        case btn.tasks.view:
            check_input = { value: ctx.msgId, text: ctx.message.text }
            sendData(ctx, 5, 0, true);
            back = 'tasks'
            break;
        // TASKS END
        case btn.home.finance:
            listWorkers(ctx, 'finance');
            break;
        case btn.home.add_delete_user:
            ctx.reply(`Yangi ishchi qo'shish yoki o'chirishni tanlang 👇`, {
                reply_markup: {
                    keyboard: kb.add_delete_user,
                    resize_keyboard: true
                }
            })
            back = 'home'
            break;
        case btn.add_delete_user.add:
            check_input = { type: 'add_user', value: ctx.msgId, text: ctx.message.text }
            ctx.reply(`Yangi foydalanuvchini q'shish uchun foydalanuvchi sizga yuborgan xabarni botga <b>forward</b> qiling.`, {
                parse_mode: 'HTML'
            })
            break;
        case btn.add_delete_user.delete:
            check_input = { type: 'delete_user', value: ctx.msgId, text: ctx.message.text }
            ctx.reply(`Yangi foydalanuvchini o'chirish uchun foydalanuvchi sizga yuborgan xabarni botga <b>forward</b> qiling.`, {
                parse_mode: 'HTML'
            })
            break;
        case btn.home.feedback:
            viewFeedback(ctx, 0);
            break;
        case btn.back:
            check_input = {};
            backAdmin(ctx, admin, back)
            break;
        default:
            console.log(check_input);
            if (check_input !== '{}' && check_input.value == ctx.msgId - 2) {
                AdminDescription(ctx, check_input)
                if (check_input.type == 'send') {
                    tasksView(ctx)
                    const task = new Tasks({ admin_id: ctx.from.id, user_id: 1, task: ctx.message.text, created_date: new Date() });
                    task.save();
                }
            }
            break;
    }
}

async function sendData(ctx, limit, skip, isAdmin) {
    const count = await Tasks.countDocuments(isAdmin ? {} : { user_id: ctx.from.id });
    const totalPages = Math.floor((count - 1) / limit) + 1;
    let tasks = []
    if (isAdmin) {
        tasks = await Tasks.find().sort({ created_date: -1 }).limit(limit).skip(skip);
    } else {
        tasks = await Tasks.find({ user_id: ctx.from.id }).sort({ created_date: -1 }).limit(limit).skip(skip);
    }
    console.log(count, totalPages)

    let message = `Vazifalar ${skip + 1}/${totalPages}\n\n`;
    let i = (skip * limit) + 1;
    tasks.forEach(t => {
        message += `—————————————————\n`
        message += `${i})\n<i>${t.task}</i>\n${dateFormat(t.created_date) + ' ' + getHours(t.created_date) + ':' + getMinutes(t.created_date)}\n`;
        i++;
    })
    let inline = [];
    if (skip != 0) {
        inline.push({
            text: '⬅️',
            callback_data: "left_" + skip,
        })
    }
    if (totalPages > skip + 1) {
        inline.push({
            text: '➡️',
            callback_data: "right_" + skip,
        })
    }
    await ctx.api.sendMessage(ctx.from.id, message,
        {
            reply_markup: {
                inline_keyboard: [
                    inline
                ],
                resize_keyboard: true
            },
            parse_mode: 'HTML'
        }
    );
}

module.exports = { forAdmin, sendData }