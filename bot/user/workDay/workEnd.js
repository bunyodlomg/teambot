const { Attendance, User } = require("../../../models/model")
const { dateFormat, hoursFormat, minutesFormat } = require("../../helper/dateFormat")
const kb = require('../../keyboard/user_keyboard/keyboard');


const workEnd = async (ctx, user) => {
    const admins = await User.find({ admin: true }).lean()
    const f_name = user.first_name + ' ' + user.last_name
    const checkUser = await Attendance.findOne({ user_id: user.id }).sort({ 'created_date': -1 }).lean()
    if (checkUser) {
        if (dateFormat(checkUser.created_date) === dateFormat() && checkUser.end_date === null && checkUser.start_date !== null) {
            await Attendance.findOneAndUpdate({ user_id: user.id }, { end_date: new Date() }, { new: true, sort: { 'created_date': -1 } });
            admins.forEach(async admin => {
                await ctx.api.sendMessage(admin.id, `${f_name} ishni ${hoursFormat() + ':' + minutesFormat()}da tugatdi!`);
            });
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