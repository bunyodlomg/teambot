const { Bot, GrammyError, HttpError } = require('grammy');
const { User, Attendance, Finance } = require('../models/model');
const { tasksSend } = require('./admin/tasksSend');
const { sendData } = require('./admin/admin');
const { dateYHM, dateHM, dateFormat } = require('./helper/dateFormat');
const { viewFeedback } = require('./admin/feedback');
const { rules } = require('./user/rules');
require('dotenv').config()
const bot = new Bot(process.env.TOKEN)

let usersId = [],
    userList = []
list = ``;


bot.on('callback_query:data', async ctx => {
    const callbackData = ctx.callbackQuery.data;
    if (callbackData.startsWith('right_')) {
        ctx.deleteMessage();
        const skip = parseInt(ctx.callbackQuery.data.substring(6));
        sendData(ctx, 5, skip + 1, true)
    } else if (callbackData.startsWith('left_')) {
        ctx.deleteMessage();
        const skip = parseInt(ctx.callbackQuery.data.substring(5));
        sendData(ctx, 5, skip == 0 ? 0 : skip - 1, true)
    } else if (callbackData.startsWith('atd_right_')) {
        ctx.deleteMessage()
        const user_id = callbackData.substring(10, callbackData.indexOf('/'));
        const skip = parseInt(callbackData.substring(callbackData.indexOf('/') + 1));
        attendance(ctx, user_id, skip + 1)
    } else if (callbackData.startsWith('atd_left_')) {
        ctx.deleteMessage()
        const user_id = callbackData.substring(9, callbackData.indexOf('/'));
        const skip = parseInt(callbackData.substring(callbackData.indexOf('/') + 1));
        attendance(ctx, user_id, skip == 0 ? 0 : skip - 1)
    } else if (callbackData.startsWith('user_')) {
        const user_id = parseInt(callbackData.substring(5));
        attendance(ctx, user_id, 0);
    } else if (callbackData.startsWith('finance_right_')) {
        ctx.deleteMessage()
        const user_id = callbackData.substring(14, callbackData.indexOf('/'));
        const skip = parseInt(callbackData.substring(callbackData.indexOf('/') + 1));
        finance(ctx, user_id, skip + 1)
    } else if (callbackData.startsWith('finance_left_')) {
        ctx.deleteMessage()
        const user_id = callbackData.substring(13, callbackData.indexOf('/'));
        const skip = parseInt(callbackData.substring(callbackData.indexOf('/') + 1));
        finance(ctx, user_id, skip == 0 ? 0 : skip - 1)
    } else if (callbackData.startsWith('finance_')) {
        const user_id = parseInt(callbackData.substring(8));
        finance(ctx, user_id, 0);
    } else if (callbackData.startsWith('feedback_right_')) {
        ctx.deleteMessage()
        const skip = parseInt(callbackData.substring(15));
        viewFeedback(ctx, skip + 1)
    } else if (callbackData.startsWith('feedback_left_')) {
        ctx.deleteMessage()
        const skip = parseInt(callbackData.substring((14)));
        viewFeedback(ctx, skip == 0 ? 0 : skip - 1)
    } else if (callbackData === 'send') {
        tasksSend(ctx, usersId)
        ctx.deleteMessage();
    } else if (callbackData === 'rules_accept') {
        rules(ctx)
    } else if (callbackData.includes('select_')) {
        const id = callbackData.split('_')[1]
        const user = await User.findOne({ id })
        const full_name = user.first_name + user.last_name
        if (usersId.includes(id)) {
            usersId.splice(usersId.indexOf(id), 1);
            userList.splice(userList.indexOf(full_name), 1)
        } else {
            usersId.push(id)
            userList.push(full_name)
        }
        userList.map(u => {
            list += `${u}\n`
        })
        await ctx.answerCallbackQuery({ text: list.length ? list : 'Barcha ishchilar belgilangan!', show_alert: true });
        list = ``;
    }

})


async function attendance(ctx, user_id, skip) {
    const limit = 5;
    const user = await User.findOne({ id: user_id });
    const count = await Attendance.countDocuments({ user_id: user_id });
    const totalPages = Math.floor((count - 1) / limit) + 1;
    const attendance = await Attendance.find({ user_id: user_id }).limit(limit).skip(skip);
    let message = `${skip + 1}/${totalPages}\n\n${user.first_name} ${user.last_name}\n`;
    attendance.forEach((attend) => {
        message += `—————————————————\n`
        if (attend.status === 'START') {
            message += '<b>' + dateFormat(attend.created_date) + '</b>\n'
            attend.late_date ? message += dateHM(attend.late_date) + '- <b>KECHIKISH</b>\n<b>Sababi</b>: <i>' + attend.description + '</i>\n' : ''
            attend.start_date ? message += dateHM(attend.start_date) + '- <b>ISH BOSHLADI</b>\n' : ''
            attend.end_date ? message += dateHM(attend.end_date) + '- <b>ISH TUGADI</b>\n' : ''
        } else {
            message += '\n' + dateYHM(attend.created_date) + '- <b>KELMADI</b>\n<b>Sababi</b>: <i>' + attend.description + '</i>\n'
        }
        //     message += `${
        // attend.status === 'NOT_START'
        //         ? '\n' + dateYHM(attend.created_date) + '- <b>KELMADI</b>\nSababi: ' + attend.description + '\n'
        //         : attend.late_date && attend.start_date === null
        //             ? '\n' + dateYHM(attend.created_date) + '- <b>KECHIKISH</b>\nSababi: ' + attend.description + '\n'
        //             : attend.late_date && attend.start_date ? '\n' + dateYHM(attend.created_date) + '- <b>KECHIKISH</b>\n<b>Sababi</b>: ' + attend.description + '\n' + dateHM(attend.start_date) + '- ISH BOSHLADI' : dateYHM(attend.start_date) + ' da ishni boshlagan' + attend.end_date && '\n' + dateYHM(attend.end_date) + '<b>ISH TUGADI</b>'}`;
    });
    const inline = []
    if (skip != 0) {
        inline.push({
            text: '⬅️',
            callback_data: `atd_left_${user_id} / ${skip}`,
        })
    }
    if (totalPages > skip + 1) {
        inline.push({
            text: '➡️',
            callback_data: `atd_right_${user_id} / ${skip}`,
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

async function finance(ctx, user_id, skip) {
    const limit = 5;
    const user = await User.findOne({ id: user_id });
    const count = await Finance.countDocuments({ user_id: user_id });
    const totalPages = Math.floor((count - 1) / limit) + 1;
    const finances = await Finance.find({ user_id: user_id }).limit(limit).skip(skip);
    let message = `Natijalar ${skip + 1}/${totalPages}\n\n${user.first_name} ${user.last_name}\n\n`;
    finances.forEach((finance) => {
        message += `${dateYHM(finance.created_date)}————${finance.summa} so'm ${finance.status == 'INGOING' ? '➕' : '➖'}\n`;
    });
    const inline = []
    if (skip != 0) {
        inline.push({
            text: '⬅️',
            callback_data: `finance_left_${user_id}/${skip}`,
        })
    }
    if (totalPages > skip + 1) {
        inline.push({
            text: '➡️',
            callback_data: `finance_right_${user_id}/${skip}`,
        })
    }
    await ctx.reply(message,
        {
            reply_markup: {
                inline_keyboard: [
                    inline
                ],
                resize_keyboard: true
            }
        }
    );
}



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


module.exports = { bot }

require('./message')