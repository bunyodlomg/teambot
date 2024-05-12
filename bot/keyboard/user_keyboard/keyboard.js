const btn = require('./buttons')

module.exports = {
    // /home
    home: [
        [btn.home.today],
        [btn.home.vazifalar],
        [btn.home.sarf_harajat],
        [btn.home.nizom],
        [btn.home.offer_complaint],
    ],
    // /home/today
    today: [
        [btn.today.start, btn.today.end],
        [btn.today.late],
        [btn.today.not_start],
        [btn.today.queue],
        ['Ortga qaytish 🔙']
    ],
    nizom: [
        [{ text: 'Tanishdim ✅', callback_data: 'accept' }]
    ]
}
