const { Attendance } = require("../../models/model")
const { dateFormat } = require("../helper/dateFormat")
const kb = require('../keyboard/user_keyboard/keyboard');


const workEnd = async (ctx, id) => {
    const checkUser = await Attendance.findOne({ user_id: id }).sort({ 'created_date': -1 }).lean()
    if (checkUser) {
        if (dateFormat(checkUser.created_date) === dateFormat() && checkUser.end_date === null && checkUser.start_date !== null) {
            await Attendance.findOneAndUpdate({ user_id: id }, { end_date: new Date() }, { new: true, sort: { 'created_date': -1 } });
            await ctx.reply(`Qabul qilindi ✅`, {
                reply_markup: {
                    keyboard: kb.home,
                }
            })
        } else if (checkUser.end_date !== null && dateFormat(checkUser.end_date) === dateFormat()) {
            await ctx.reply(`Siz ishni tugatib bo'lgansiz❗`, {
                reply_markup: {
                    keyboard: kb.home,
                }
            })
        } else {
            if (checkUser.status === 'NOT_START') {
                await ctx.reply(`Siz bugun kelmadingiz❗`, {
                    reply_markup: {
                        keyboard: kb.home,
                    }
                })
            }
        }
    } else {
        await ctx.reply(`Siz hali ishni boshlamadingiz❗`, {
            reply_markup: {
                keyboard: kb.home,
            }
        })
    }
}
module.exports = { workEnd }