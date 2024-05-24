const { User, Tasks } = require("../../models/model");

const tasksSend = async (ctx, u) => {
    const users = await User.find({ admin: false })
    if (u.length === 0) {
        users.forEach(async user => {
            u.push(user.id);
        });
    }
    let key = []
    const task = await Tasks.findOne({ admin_id: ctx.from.id }).sort({ created_date: -1 });
    users.forEach(user => key.push([{ text: `${user.first_name + ' ' + user.last_name}`, callback_data: `${user.id}` }]))
    u.forEach(async user => {
        const tasksData = new Tasks({
            user_id: user,
            task: task.task,
            created_date: new Date(),
        })
        tasksData.save()
        await ctx.api.sendMessage(user, 'Sizga yangi vazifa berildi!\nVazifa : ' + task.task);
    });
    await ctx.reply('Vazifalar foydalanuvchilarga yuborildi!');
    // const res = await Tasks.findByIdAndDelete(task._id);
}
module.exports = { tasksSend }