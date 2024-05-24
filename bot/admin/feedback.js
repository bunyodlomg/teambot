const { Feedback } = require("../../models/model");
const { dateYHM } = require("../helper/dateFormat");

async function viewFeedback(ctx, skip) {
    let limit = 5;
    const count = await Feedback.countDocuments();
    const totalPages = Math.floor((count - 1) / limit) + 1;
    const tasks = await Feedback.find().sort({ created_date: -1 }).limit(limit).skip(skip);
    let message = `Taklif / Shikoyat ${skip + 1}/${totalPages}\n\n`;
    let i = (skip * limit) + 1;
    tasks.forEach(t => {
        message += `—————————————————\n`
        message += `${i}) ${t.feedback}\n${dateYHM(t.created_date)}\n`;
        i++;
    })
    let inline = [];
    if (skip != 0) {
        inline.push({
            text: '⬅️',
            callback_data: "feedback_left_" + skip,
        })
    }
    if (totalPages > skip + 1) {
        inline.push({
            text: '➡️',
            callback_data: "feedback_right_" + skip,
        })
    }
    await ctx.reply(message,
        {
            reply_markup: {
                inline_keyboard: [
                    inline
                ],
                resize_keyboard: true
            }
        }
    );
}

module.exports = {
    viewFeedback
}