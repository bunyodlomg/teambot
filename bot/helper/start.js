
const { User } = require('../../models/model');
const { forAdmin } = require('../admin/admin');
const { forUser } = require('../user/user');
const start = async (ctx, text) => {
    const id = ctx.from.id
    const checkUser = await User.findOne({ id }).lean()

    if (checkUser) {
        if (checkUser.admin) {
            await forAdmin(ctx, text, checkUser)
        } else {
            await forUser(ctx, text, checkUser)
        }
    } else {
        ctx.reply(`Afsuski siz bu bot dan foyalana olmaysiz!`)
    }
}
module.exports = { start }