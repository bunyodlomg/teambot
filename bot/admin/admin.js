const { Tasks, User, Finance } = require('../../models/model');
const { dateFormat, dateYHM, dateMDH, firstAndLastDateOfMonth } = require('../helper/dateFormat');
const btn = require('../keyboard/admin_keyboard/buttons');
const kb = require('../keyboard/admin_keyboard/keyboard');
const { backAdmin } = require('./back');
const { listWorkers } = require("./listWorkers");
const { tasksView } = require("./tasksView");
const { AdminDescription } = require('./AdminDescription');
const { getHours, getMinutes } = require('date-fns');
const { viewFeedback } = require('./feedback');
const xlsx = require('xlsx');
const { InputFile } = require('grammy');

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
        case "Oylik Hisobotlar":
            reportOfMonth(ctx);
            check_input = {};
            break;
        default:
            console.log(check_input);
            if (check_input !== '{}' && check_input.value == ctx.msgId - 2) {
                AdminDescription(ctx, check_input)
                if (check_input.type == 'send') {
                    tasksView(ctx)
                    const task = new Tasks({ admin_id: ctx.from.id, task: ctx.message.text, created_date: new Date() });
                    task.save();
                }
            }
            break;
    }
}


async function reportOfMonth(ctx) {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let datas = await Finance.find({ "created_date": { "$gte": firstDay, "$lt": lastDay } })
    const data = [];
    if (datas.length == 0) {
        await ctx.reply("Malumot yo'q");
    } else {
        for (let i = 0; i < datas.length; i++) {
            const it = datas[i];
            const user = await User.findOne({ id: it.user_id });
            data.push({
                ism: user.first_name + " " + user.last_name,
                vaqt: it.created_date,
                summa: it.summa,
                sabab: it.description,
                status: it.status === "INGOING" ? "kirim" : "chiqim"
            })
        }
        let overallIngoingSumma = 0;
        let overallOngoingSumma = 0;
        const userMapIn = new Map();
        const userMapOn = new Map();
        console.log(data);
        data.forEach(it => {
            if (it.status == 'INGOING') {
                overallIngoingSumma += it.summa;
                if (userMapIn.has(it.user_id)) {
                    let s = userMapIn.get(it.user_id);
                    userMapIn.set(it.user_id, s + it.summa)
                } else {
                    userMapIn.set(it.user_id, it.summa)
                }
            } else if (it.status == 'OUTGOING') {
                overallOngoingSumma += it.summa;
                if (userMapOn.has(it.user_id)) {
                    let s = userMapOn.get(it.user_id);
                    userMapOn.set(it.user_id, s + it.summa)
                } else {
                    userMapOn.set(it.user_id, it.summa)
                }
            }
        })

        // console.log(overallIngoingSumma);
        // console.log(overallOngoingSumma);
        // console.log(userMapIn);
        // console.log(userMapOn);


        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = {
            SheetNames: ['Sheet1'],
            Sheets: {
                'Sheet1': worksheet
            }
        };
        xlsx.writeFile(workbook, 'output.xlsx');


        const data2 = [{
            umumiyKirim: overallIngoingSumma,
            umumiyChiqim: overallOngoingSumma,
        }]

        const worksheet2 = xlsx.utils.json_to_sheet(data2);
        const workbook2 = {
            SheetNames: ['Sheet1'],
            Sheets: {
                'Sheet1': worksheet2
            }
        };
        xlsx.writeFile(workbook2, 'output2.xlsx');
        const fileCont1 = Buffer.from("Hisobot.xlsx")
        const fileCont2 = Buffer.from("Oylik_Hisobot.xlsx")
        await ctx.replyWithDocument(new InputFile("C:/Users/Bunyod/Desktop/node-bot/output.xlsx",fileCont1))
        await ctx.replyWithDocument(new InputFile("C:/Users/Bunyod/Desktop/node-bot/output2.xlsx",fileCont2))
    }
}

async function sendData(ctx, limit, skip, isAdmin) {
    const count = await Tasks.countDocuments(isAdmin ? {} : { 'users_id.status': "COMPLETED", 'users_id.user_id': ctx.from.id });
    const totalPages = Math.floor((count - 1) / limit) + 1;
    let tasks = []

    console.log(limit, skip)

    if (isAdmin) {
        tasks = await Tasks.find({ 'users_id.user_id': { $ne: "1" } }).sort({ created_date: -1 }).limit(limit).skip(skip);
    } else {
        tasks = await Tasks.find({ 'users_id.user_id': ctx.from.id, 'users_id.status': "COMPLETED" }).sort({ created_date: -1 }).limit(limit).skip(skip);
    }

    let message = `Vazifalar ${skip == 0 ? 1 : skip / limit}/${totalPages}\n\n`;
    let i = skip + 1;

    function formatt(params) {
        if (params.status === "SENDED") return `Yuborildi : ${dateMDH(params.sended)}`;
        if (params.status === "ACCEPTED") return `Qabul qilindi : ${dateMDH(params.accepted)}`;
        if (params.status === "COMPLETED") return `Yakunlandi : ${dateMDH(params.completed)}`;
    }

    // let inline2 = [];
    for (let j = 0; j < tasks.length; j++) {
        const value = tasks[j];

        // inline2.push({
        // text: i.toString(),
        // callback_data: "task_find_"+value._id
        // })

        message += `—————————————————\n`
        message += `${i})\n${value.task}\n${dateYHM(value.created_date)}\n\n`;

        for (let i = 0; i < value.users_id.length; i++) {
            const user = await User.findOne({ id: value.users_id[i].user_id });
            message += `<b>${user.first_name + ' ' + user.last_name}</b> :\n<i>${formatt(value.users_id[i])}</i>\n`;
        }
        i++;
    }
    // tasks.forEach(t => {
    //     message += `—————————————————\n`
    //     message += `${i})\n<i>${t.task}</i>\n${dateFormat(t.created_date) + ' ' + getHours(t.created_date) + ':' + getMinutes(t.created_date)}\n${t.user_id}`;
    //     i++;
    // })
    let inline = [];
    if (skip != 0) {
        inline.push({
            text: '⬅️',
            callback_data: "left_" + skip,
        })
    }
    if (totalPages > (skip / limit) + 1) {
        inline.push({
            text: '➡️',
            callback_data: "right_" + skip,
        })
    }

    await ctx.api.sendMessage(ctx.from.id, message,
        {
            reply_markup: {
                inline_keyboard: [
                    inline,
                ]
            },
            parse_mode: 'HTML'
        }
    );
}

module.exports = { forAdmin, sendData }