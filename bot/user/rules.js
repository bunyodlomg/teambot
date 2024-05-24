const { User } = require("../../models/model");

const rules = async (ctx) => {
    const id = ctx.from.id;
    const user = await User.findOne({ id })
    if (user.rule) {
        ctx.reply('Siz ichki nizomlarga rozilik bildirib bo\'lgansiz !')
    } else {
        await User.findOneAndUpdate({ id }, { rule: true }, { new: true })
        ctx.reply('Siz ichki nizomlarga rozilik bildirdingiz ✅')
    }
}
module.exports = { rules };