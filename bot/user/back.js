const kb = require('../keyboard/user_keyboard/keyboard');

const backUser = async (ctx, user, back) => {
    switch (back) {
        case 'home':
            await ctx.reply(`Assalomu alaykum ${user.first_name + '' + user.last_name}! \nQuyidagi bo'limlardan birini tanlang 👇`, {
                reply_markup: {
                    keyboard: kb.home
                }
            })
            break;
        case 'today':
            await ctx.reply(`Kerakli bo'limni tanlang 👇`, {
                reply_markup: {
                    keyboard: kb.today
                }
            })
            break;
        default:
            break;
    }
}
module.exports = { backUser }