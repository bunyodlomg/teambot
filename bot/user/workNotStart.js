const { Attendance } = require("../../models/model")
const { dateFormat } = require("../helper/dateFormat")
const kb = require('../keyboard/user_keyboard/keyboard');

const workNotStart = async (ctx, id) => {
    console.log(ctx.message.text);
    const checkUser = await Attendance.findOne({ user_id: id }).sort({ 'created_date': -1 }).lean()
    const notStartDate = new Attendance({
        user_id: id,
        created_date: new Date(),
        status: "NOT_START",
        description: ctx.message.text
    })
    if (checkUser) {
        if (dateFormat(checkUser.created_date) !== dateFormat()) {
            notStartDate.save()
            await ctx.reply(`Qabul qilindi ✅`, {
                reply_markup: {
                    keyboard: kb.home,
                }
            })
        } else if (dateFormat(checkUser.created_date) === dateFormat() && checkUser.status === 'START') {
            await ctx.reply(`To'g'ri tugmani bosing❗`, {
                reply_markup: {
                    keyboard: kb.home,
                }
            })
        }
        else {
            await ctx.reply(`To'g'ri tugmani bosing❗`, {
                reply_markup: {
                    keyboard: kb.home,
                }
            })
        }
    } else {
        notStartDate.save()
        await ctx.reply(`Qabul qilindi ✅`, {
            reply_markup: {
                keyboard: kb.home,
            }
        })
    }
}

module.exports = { workNotStart }