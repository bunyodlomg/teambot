const btn = require('./buttons')

module.exports = {
    home: [
        [btn.home.workers],
        [btn.home.tasks, btn.home.finance],
        [btn.home.add_delete_user],
        [btn.home.report],
        [btn.home.feedback],
    ],
    tasks: [
        [btn.tasks.view, btn.tasks.send],
        [btn.back]
    ],
    add_delete_user: [
        [btn.add_delete_user.add, btn.add_delete_user.delete],
        [btn.back]
    ]
}
