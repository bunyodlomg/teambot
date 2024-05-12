const { bot } = require('../bot');
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

        // Yangi user qo'shish
        /*
        const insertUser = new User({
            id,
            first_name: ctx.from.first_name ? ctx.from.first_name : '',
            last_name: ctx.from.last_name ? ctx.from.last_name : '',
            action: 'home',
            admin: false
        })
        await insertUser.save()
        console.log('user saved!');
        */
    } else {
        ctx.reply(`Afsuski siz bu bot dan foyalana olmaysiz!`)
        // ctx.reply(await User.find())
    }
}
module.exports = { start }