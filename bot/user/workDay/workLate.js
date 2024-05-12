const { Attendance } = require("../../../models/model")
const { dateFormat } = require("../../helper/dateFormat")
const kb = require('../../keyboard/user_keyboard/keyboard');

const workLate = async (ctx, id) => {
    const checkUser = await Attendance.findOne({ user_id: id }).sort({ 'created_date': -1 }).lean()
    const lateDate = new Attendance({
        user_id: id,
        late_date: String(new Date()),
        created_date: new Date(),
        status: "START",
        description: ctx.message.text
    })
    if (checkUser) {
        if (dateFormat(checkUser.created_date) !== dateFormat() && checkUser.end_date === null && checkUser.start_date === null) {
            lateDate.save()
            await ctx.reply(`Qabul qilindi ✅`, {
                reply_markup: {
                    keyboard: kb.home,
                }
            })
        } else {
            await ctx.reply(`To'g'ri tugmani bosing❗`, {
                reply_markup: {
                    keyboard: kb.home,
                }
            })
        }
    } else {
        lateDate.save()
        await ctx.reply(`Qabul qilindi ✅`, {
            reply_markup: {
                keyboard: kb.home,
            }
        })
    }
}

module.exports = { workLate }