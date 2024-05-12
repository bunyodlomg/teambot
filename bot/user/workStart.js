const { Attendance } = require("../../models/model")
const { dateFormat, hoursFormat, minutesFormat } = require("../helper/dateFormat")
const kb = require('../keyboard/user_keyboard/keyboard');


const workStart = async (ctx, user, id) => {
    const checkUser = await Attendance.findOne({ user_id: id }).sort({ 'created_date': -1 }).lean()
    const startDate = new Attendance({
        user_id: id,
        start_date: new Date(),
        created_date: new Date(),
        status: "START"
    })
    if (checkUser) {
        if (dateFormat(checkUser.created_date) !== dateFormat() && checkUser.late_date === null && checkUser.end_date === null) {
            ctx.react(hoursFormat() < 8 ? '👍' : hoursFormat() == 8 && minutesFormat() < 20 ? '👌' : '👎')
            startDate.save()
            await ctx.reply(`${user.first_name + ' ' + user.last_name} ishingizga omad tilayman!`, {
                reply_markup: {
                    keyboard: kb.home,
                    remove_keyboard: true
                }
            })
        } else if (checkUser.start_date === null && checkUser.late_date !== null && dateFormat(checkUser.late_date) === dateFormat()) {
            await Attendance.findOneAndUpdate({ user_id: id }, { start_date: new Date() }, { new: true, sort: { 'created_date': -1 } });
            await ctx.reply(`${user.first_name + ' ' + user.last_name} eni vaqtida keling!`, {
                reply_markup: {
                    keyboard: kb.home,
                    remove_keyboard: true
                }
            })
        } else {
            ctx.react('🤨')
            await ctx.reply(`Siz ishni boshlagansiz❗`, {
                reply_markup: {
                    keyboard: kb.home,
                    remove_keyboard: true
                }
            })
        }
    } else {
        startDate.save()
        ctx.react(hoursFormat() < 8 ? '👍' : hoursFormat() == 8 && minutesFormat < 20 ? '👌' : '👎')
        await ctx.reply(`${user.first_name + ' ' + user.last_name} ishingizga omad tilayman!`, {
            reply_markup: {
                keyboard: kb.home,
                remove_keyboard: true
            }
        })
    }
}

module.exports = { workStart }