const { Attendance } = require("../../../models/model")

const test = (ctx, id = 5504673121) => {
    const ddd = new Date();
    for (let i = 1; i < 6; i++) {
        const startDate = new Attendance({
            user_id: id,
            start_date: ddd.setDate(ddd.getDate() - i),
            created_date: ddd.setDate(ddd.getDate() - i),
            status: "START"
        })
        startDate.save()
    }
    for (let i = 1; i < 6; i++) {
        const startDate = new Attendance({
            user_id: id,
            created_date: ddd.setDate(ddd.getDate() - i),
            status: "NOT_START"
        })
        startDate.save()
    }
    for (let i = 1; i < 6; i++) {
        const lateDate = new Attendance({
            user_id: id,
            late_date: ddd.setDate(ddd.getDate() - i),
            created_date: ddd.setDate(ddd.getDate() - i),
            status: "START",
            description: ctx.message.text
        })
        lateDate.save()
    }
}

module.exports = { test }