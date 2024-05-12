const { User } = require("../../models/model");
const kb = require("../keyboard/admin_keyboard/keyboard");

const listWorkers = async (ctx) => {
    const users = await User.find({ admin: false }).sort({ first_name: 1 });
    let usersList = ``
    users.filter((user, i) => {
        usersList += (i + 1 + ' - ' + user.first_name + ' ' + user.last_name + '\n');
    })
    ctx.reply(usersList)
}
module.exports = {
    listWorkers
}