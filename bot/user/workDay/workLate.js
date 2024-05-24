const { Attendance, User } = require("../../../models/model")
const { dateFormat } = require("../../helper/dateFormat")
const kb = require('../../keyboard/user_keyboard/keyboard');

const workLate = async (ctx, user) => {
    const admins = await User.find({ admin: true }).lean()
    const checkUser = await Attendance.findOne({ user_id: user.id }).sort({ 'created_date': -1 }).lean()
    const f_name = user.first_name + ' ' + user.last_name
    const lateDate = new Attendance({
        user_id: user.id,
        late_date: String(new Date()),
        created_date: new Date(),
        status: "START",
        description: ctx.message.text
    })
    if (checkUser) {
        if (dateFormat(checkUser.created_date) !== dateFormat() && checkUser.end_date === null && checkUser.start_date === null) {

            admins.forEach(async admin => {
                await ctx.api.sendMessage(admin.id, `${f_name} bugun ishga kech qoladi`);
            });
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
        admins.forEach(async admin => {
            await ctx.api.sendMessage(admin.id, `${f_name} bugun ishga kech qoladi`);
        });
        lateDate.save()
        await ctx.reply(`Qabul qilindi ✅`, {
            reply_markup: {
                keyboard: kb.home,
            }
        })
    }
}

module.exports = { workLate }