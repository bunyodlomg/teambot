const kb = require('../keyboard/admin_keyboard//keyboard');

const backAdmin = async (ctx, admin, back) => {
    switch (back) {
        case '':
            await ctx.reply(`Assalomu alaykum ${admin.first_name + ' ' + admin.last_name}! \nQuyidagi bo'limlardan birini tanlang 👇`, {
                reply_markup: {
                    keyboard: kb.home,
                    resize_keyboard: true
                }
            })
            break;
        case 'home':
            await ctx.reply(`Kerakli bo'limni tanlang 👇`, {
                reply_markup: {
                    keyboard: kb.home,
                    resize_keyboard: true

                }
            })
            break;
        case 'tasks':
            await ctx.reply(`Kerakli bo'limni tanlang 👇`, {
                reply_markup: {
                    keyboard: kb.tasks,
                    resize_keyboard: true,
                }
            })
            break;
        default:
            break;
    }
}
module.exports = { backAdmin }