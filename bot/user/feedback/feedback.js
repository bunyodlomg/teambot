const { Feedback } = require("../../../models/model")

const feedback = async (ctx) => {
    const feedbackDate = new Feedback({
        feedback: ctx.message.text,
        created_date: new Date()
    })
    feedbackDate.save()
    await ctx.reply("Fikr-mulohazangiz uchun rahmat!")
}

module.exports = { feedback }