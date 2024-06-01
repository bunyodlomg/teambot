const { Finance, Tasks } = require('../../models/model');
const btn = require("../keyboard/user_keyboard/buttons");
const kb = require('../keyboard/user_keyboard/keyboard');
const { workStart } = require("./workDay/workStart");
const { workEnd } = require("./workDay/workEnd");
const { backUser } = require("./back");
const { workDescription } = require("./workDescription");
const { reason } = require("./reason");
const { usersQueue } = require("./workDay/usersQueue");
const { sendData } = require('../admin/admin');
const { dateYHM } = require('../helper/dateFormat');
// const { test } = require("./workDay/TEST.JS");

let back = '',
    check_input = {};

const forUser = async (ctx, text, user) => {
    const id = user.id
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
        // case 'test':
        //     test(ctx)
        //     break;

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
            workStart(ctx, user)
            back = 'today'
            break;
        case btn.today.end:
            check_input = {};
            workEnd(ctx, user)
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

        // RULES START
        // RULES END

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

        case btn.home.tasks:
            check_input = {};
            await ctx.reply(`Kerakli bo'limni tanlang 👇`, {
                reply_markup: {
                    keyboard: kb.tasks,
                    resize_keyboard: true
                }
            })
            back = ''
            break;
        case btn.tasks.completed:
            sendData(ctx, 5, 0, false);
            break;
        case btn.tasks.sended_and_accepted:
            sendedAndAcceptedData(ctx);
            break;
        case btn.home.finance:
            ctx.reply("Kerakli bo'limni tanlang 👇", {
                reply_markup: {
                    keyboard: kb.finance,
                    resize_keyboard: true,
                }
            })
            check_input = 'finance_outgoing';
            back = ''
            break;

        case btn.finance.outgoing:
            ctx.reply("Namuna\n\n<b>13000</b>,<i>Qatiq sotib oldim</i>\n\n<b>Vergul (,) bo'lishis shart</b>", { parse_mode: "HTML" })
            check_input = 'finance_outgoing'
            back = ''
            break;

        case btn.finance.ingoing:
            ctx.reply("Namuna\n\n<b>500.000</b>,<i>Imtihonim uchun pul oldim</i>\n\n<b>Vergul (,) bo'lishis shart</b>", { parse_mode: "HTML" })
            check_input = 'finance_ingoing'
            back = ''
            break;

        case btn.home.rules:
            ctx.api.sendMessage(ctx.from.id, "<a href='https://telegra.ph/Nizom-05-16'>ICHKI NIZOMLAR</a>", {
                reply_markup: {
                    inline_keyboard: [[{ text: 'Tanishdim ✅', callback_data: 'rules_accept' }]]
                },
                parse_mode: "HTML"
            })
            break;

        case btn.back:
            check_input = {};
            backUser(ctx, user, back)
            break;
        default:
            if (check_input !== '{}' && check_input.value == ctx.msgId - 2) {
                workDescription(ctx, check_input.type, user)
            } else if (check_input === "finance_outgoing") {
                const msg = ctx.message.text.split(",");
                if (msg.length !== 2) {
                    ctx.reply("Malumot saqlanmadi. Iltimos namunaga amal qilgan holda yozing !!!");
                    break;
                }
                let summa = 0;
                try {
                    summa = parseFloat(msg[0]);
                } catch (error) {
                    ctx.reply("Malumot saqlanmadi. Iltimos namunaga amal qilgan holda yozing !!!");
                    break;
                }
                const desc = msg[1];
                const finance = new Finance({ user_id: user.id, created_date: new Date(), summa: summa, description: desc, status: "OUTGOING" });
                finance.save();
                ctx.reply("Malumot saqlandi");
            } else if (check_input === "finance_ingoing") {
                const msg = ctx.message.text.split(",");
                if (msg.length !== 2) {
                    ctx.reply("Malumot saqlanmadi. Iltimos namunaga amal qilgan holda yozing !!!");
                    break;
                }
                let summa = 0;
                try {
                    summa = parseFloat(msg[0]);
                } catch (error) {
                    ctx.reply("Ma'lumot saqlanmadi. Iltimos namunaga amal qilgan holda yozing !!!");
                    break;
                }
                const desc = msg[1];
                const finance = new Finance({ user_id: user.id, created_date: new Date(), summa: summa, description: desc, status: "INGOING" });
                finance.save();
                ctx.reply("Malumot saqlandi");
            }
            break;
    }

}

async function sendedAndAcceptedData(ctx) {
    const data = await Tasks.find({ 'users_id.user_id': ctx.from.id, 'users_id.status': { $ne: "COMPLETED" } });
    if (data.length) {
        for (const task of data) {
            await ctx.reply(task.task + "\n" + (task.users_id[0].status) + "\n" + dateYHM(task.created_date), {
                reply_markup: {
                    inline_keyboard: [[
                        task.users_id[0].status === "ACCEPTED" ? { text: "Tugatish", callback_data: "complete_task_" + task.users_id[0].user_id + "_" + task._id } : { text: "Qabul qilish", callback_data: "accept_task_" + task.users_id[0].user_id + "_" + task._id }
                    ]]
                }
            })
        }
    } else {
        await ctx.reply(`Vazifalar 1/0`)
    }
}

module.exports = { forUser }