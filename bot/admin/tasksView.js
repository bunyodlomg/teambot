const { User } = require("../../models/model");

const tasks = async (ctx) => {
    const users = await User.find({ admin: false })

    let key = []
    users.forEach((user) => key.push([{ text: `${user.first_name + ' ' + user.last_name}`, callback_data: `${user.id}` }]))
    key.push([{ text: 'Tanlash ✅', callback_data: "select" }]);
    ctx.reply('Vazifa berish uchun userlarni tanlang!',
        {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: key
            }
        });
}


module.exports = {
    tasks
}