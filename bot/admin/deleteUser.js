const { User } = require("../../models/model");

const deleteUser = async (ctx) => {
    const user_context = ctx.message.forward_from
    if (user_context !== undefined) {
        const user = await User.findOne({ id: user_context.id })
        if (user) {
            await User.deleteOne({ id: user_context.id });
            ctx.reply(`Ishchi o'chirildi 🗑️`)
        } else {
            ctx.reply(`Ushbu ishchi mavjud emas ❌`)
        }
    } else {
        ctx.reply(`Ushbu foydalanuvchi <b>mahfiylikni</b> o'chirishi kerak 🔓`, {
            parse_mode: 'HTML',
        })
    }
}

module.exports = {
    deleteUser
}