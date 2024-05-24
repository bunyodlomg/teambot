const btn = require('./buttons')

module.exports = {
    // /home
    home: [
        [btn.home.today],
        [btn.home.tasks],
        [btn.home.finance],
        [btn.home.rules],
        [btn.home.feedback],
    ],
    // /home/today
    today: [
        [btn.today.start, btn.today.end],
        [btn.today.late],
        [btn.today.not_start],
        [btn.today.queue],
        [btn.back]
    ],
    tasks: [[btn.tasks]],
    finance: [
        [btn.finance.ingoing,btn.finance.outgoing],
        [btn.back]
    ],
    nizom: [
        [{ text: 'Tanishdim ✅', callback_data: 'accept' }]
    ]
}
