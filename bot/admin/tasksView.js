const { User } = require("../../models/model");

const tasksView = async (ctx) => {
    const users = await User.find({ admin: false })
    let key = []

    users.forEach((user) => key.push([{ text: `${user.first_name + ' ' + user.last_name}`, callback_data: `${user.id}` }]))
    key.push([{ text: 'Yuborish ➡️', callback_data: "send" }]);
    ctx.reply(ctx.message.text,
        {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: key
            }
        });
}

module.exports = {
    tasksView
}