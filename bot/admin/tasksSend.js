const { User } = require("../../models/model")
const { bot } = require("../bot")

const tasksSend = async (ctx, u) => {
    const users = await User.find({ admin: false })
    let key = []
    users.forEach(user => key.push([{ text: `${user.first_name + ' ' + user.last_name}`, callback_data: `${user.id}` }]))
    u.forEach(async user => {
        await ctx.api.sendMessage(user, 'Sizga yangi vazifa berildi!\n');
    });
    await ctx.reply('Vazifalar foydalanuvchilarga yuborildi!');
}
module.exports = { tasksSend }