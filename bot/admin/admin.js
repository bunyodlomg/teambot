const kb = require('../keyboard/admin_keyboard/keyboard');
const {NotFound} = require("../../models/model");
const {dateMDH} = require("../helper/dateFormat");


let back = '',
    check_input = {};
const forAdmin = async (ctx, text) => {
    switch (text) {
        case '/start':
            check_input = {}
            ctx.reply(`Assalomu alaykum Admin🌟.`)
            back = ''
            break;
        case 'notfound':
            const notfound = await NotFound.find({is_checked: false})
            let message = "";
            for (let i = 0; i < notfound.length; i++) {
                const val = notfound[i];
                message += (i+1)+") "+val.text+"\n@"+val.username+"\n"+dateMDH(val.created_at)+"\n";
            }
            ctx.reply(message)
            back = ''
            break;
        default:
            ctx.reply("COMMANDS.\n" +
                "/start\n" +
                "notfound")
            break;
    }
}
module.exports = { forAdmin }