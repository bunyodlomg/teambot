const { Feedback, User } = require("../../../models/model")

const feedback = async (ctx) => {
    const admins = await User.find({ admin: true }).lean()
    const feedbackDate = new Feedback({
        feedback: ctx.message.text,
        created_date: new Date()
    })
    feedbackDate.save()
    admins.forEach(async admin => {
        await ctx.api.sendMessage(admin.id, `<b>Taklif/Shikoyat</b>\n<i>${ctx.message.text}</i>`, {
            parse_mode: 'HTML'
        });
    });
    await ctx.reply("Fikr-mulohazangiz uchun rahmat!")
}

module.exports = { feedback }