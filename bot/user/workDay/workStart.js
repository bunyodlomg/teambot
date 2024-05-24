const { Attendance, User } = require("../../../models/model")
const { dateFormat, hoursFormat, minutesFormat } = require("../../helper/dateFormat")
const kb = require('../../keyboard/user_keyboard/keyboard');

const workStart = async (ctx, user) => {
    const admins = await User.find({ admin: true }).lean()
    const f_name = user.first_name + ' ' + user.last_name
    const checkAtt = await Attendance.findOne({ user_id: user.id }).sort({ 'created_date': -1 }).lean()
    const startDate = new Attendance({
        user_id: user.id,
        start_date: new Date(),
        created_date: new Date(),
        status: "START"
    })
    if (checkAtt) {
        if (dateFormat(checkAtt.created_date) !== dateFormat()) {
            ctx.react(hoursFormat() < 8 ? '👍' : hoursFormat() == 8 && minutesFormat() < 20 ? '👌' : '👎')
            admins.forEach(async admin => {
                await ctx.api.sendMessage(admin.id, `${f_name} ishni ${hoursFormat() + ':' + minutesFormat()}da boshladi`);
            });
            startDate.save()

            await ctx.reply(`${f_name} ishingizga omad tilayman!`, {
                reply_markup: {
                    keyboard: kb.home,
                    remove_keyboard: true
                }
            })
        } else if (checkAtt.start_date === null && checkAtt.late_date !== null && dateFormat(checkAtt.late_date) === dateFormat()) {
            await Attendance.findOneAndUpdate({ user_id: user.id }, { start_date: new Date() }, { new: true, sort: { 'created_date': -1 } });
            admins.forEach(async admin => {
                await ctx.api.sendMessage(admin.id, `${f_name} ishni ${hoursFormat() + ':' + minutesFormat()}da boshladi`);
            });
            await ctx.reply(`${user.first_name + ' ' + user.last_name} iltimos ertaroq kelishga harakat qiling!`, {
                reply_markup: {
                    keyboard: kb.home,
                    remove_keyboard: true
                }
            })
        } else if (dateFormat(checkAtt.start_date) === dateFormat()) {
            ctx.react('🤨')
            await ctx.reply(`Siz ishni boshlagansiz❗`, {
                reply_markup: {
                    keyboard: kb.home,
                    remove_keyboard: true
                }
            })
        }
    } else {
        ctx.react(hoursFormat() < 8 ? '👍' : hoursFormat() == 8 && minutesFormat < 20 ? '👌' : '👎')
        admins.forEach(async admin => {
            await ctx.api.sendMessage(admin.id, `${f_name} ishni ${hoursFormat() + ':' + minutesFormat()}da boshladi`);
        });
        startDate.save()
        await ctx.reply(`${user.first_name + ' ' + user.last_name} ishingizga omad tilayman!`, {
            reply_markup: {
                keyboard: kb.home,
                remove_keyboard: true
            }
        })
    }
}

module.exports = { workStart }