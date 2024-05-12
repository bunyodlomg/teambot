const { Attendance } = require("../../models/model")
const kb = require("../keyboard/user_keyboard/keyboard")
const { dateFormat } = require('./dateFormat')
const reason = async (ctx, id) => {
    const checkUser = await Attendance.findOne({ user_id: id }).sort({ 'created_date': -1 }).lean()
    if (checkUser) {
        if (dateFormat(checkUser.created_date) === dateFormat()) {
            ctx.react('🤔')
            await ctx.reply(`To'g'ri tugmani bosing❗`, {
                reply_markup: {
                    keyboard: kb.home,
                }
            })
        }
    } else {
        await ctx.reply(`Iltimos sababini yozing ✍️`, {
            reply_markup: {
                keyboard: kb.home,
            }
        })
    }
}

module.exports = { reason }