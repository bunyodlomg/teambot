const { User } = require("../../models/model");

const addUser = async (ctx) => {
    const user_context = ctx.message.forward_from
    if (user_context !== undefined) {
        const user = await User.findOne({ id: user_context.id })
        if (!user) {
            const insertUser = new User({
                id: user_context.id,
                first_name: user_context.first_name ? user_context.first_name : '',
                last_name: user_context.last_name ? user_context.last_name : '',
                admin: false
            })
            await insertUser.save()
            ctx.reply(`Foydalanuvchi qo'shildi 👤`)
        } else {
            ctx.reply(`Ushbu foydalanuvchi avval kiritilgan!`)
        }
    } else {
        ctx.reply(`Ushbu foydalanuvchi <b>mahfiylikni</b> o'chirishi kerak!`, {
            parse_mode: 'HTML',
        })
    }
}

module.exports = {
    addUser
}