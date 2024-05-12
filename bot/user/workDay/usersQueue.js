const { User, Queue } = require("../../../models/model");
const { isSunday } = require("date-fns");
const { dateFormat } = require("../../helper/dateFormat");


const usersQueue = async (ctx) => {
    if (!isSunday(new Date())) {
        const len = await User.find({ admin: false }).countDocuments() - 1
        let queue = await Queue.findOne()
        let skip = queue.skip
        if (queue.date !== dateFormat()) {
            await Queue.findOneAndUpdate({}, { date: dateFormat(), skip: skip === len ? skip = 0 : skip += 1 }, { new: true })
        }
        let users = await User.find({ admin: false }).sort({ first_name: 1 }).skip(skip).limit(1);
        if (users) {
            if (users[0].id === ctx.from.id) {
                ctx.reply('Bugun siz navbatchi 🫵');
            } else {
                ctx.reply('Bugun ' + users[0].first_name + ' ' + users[0].last_name + ' navbatchi.');
            }
        }
    } else {
        ctx.reply('Bugun dam olish kuni 🏞️')
    }
}

module.exports = {
    usersQueue
}