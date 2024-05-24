const { User } = require("../../models/model");

const listWorkers = async (ctx, callback) => {
    const users = await User.find({ admin: false }).sort({ first_name: 1 });
    let usersList = ``
    users.filter((user, i) => {
        usersList += (i + 1 + ' - ' + user.first_name + ' ' + user.last_name + '\n');
    })

    const usersInline = [];

    users.forEach((user) => {
        usersInline.push([{ text: `${user.first_name + ' ' + user.last_name + (user.rule ? ' ✅' : '')} `, callback_data: `${callback}_${user.id}` }])
    })



    ctx.reply("Ishchilar ro'yxati", {
        reply_markup: {
            inline_keyboard: usersInline
        }
    })
}
module.exports = {
    listWorkers
}