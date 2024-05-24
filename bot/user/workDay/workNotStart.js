const { Attendance, User } = require("../../../models/model")
const { dateFormat } = require("../../helper/dateFormat")
const kb = require('../../keyboard/user_keyboard/keyboard');

const workNotStart = async (ctx, user) => {
    const admins = await User.find({ admin: true }).lean()
    const f_name = user.first_name + ' ' + user.last_name
    const checkUser = await Attendance.findOne({ user_id: user.id }).sort({ 'created_date': -1 }).lean()
    const notStartDate = new Attendance({
        user_id: user.id,
        created_date: new Date(),
        status: "NOT_START",
        description: ctx.message.text
    })
    if (checkUser) {
        if (dateFormat(checkUser.created_date) !== dateFormat()) {
            notStartDate.save()
            admins.forEach(async admin => {
                await ctx.api.sendMessage(admin.id, `${f_name} ishga kelolmaydi`);
            });
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
        admins.forEach(async admin => {
            await ctx.api.sendMessage(admin.id, `${f_name} ishga kelolmaydi`);
        });
        notStartDate.save()
        await ctx.reply(`Qabul qilindi ✅`, {
            reply_markup: {
                keyboard: kb.home,
            }
        })
    }
}

module.exports = { workNotStart }