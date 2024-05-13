const btn = require('./buttons')

module.exports = {
    // /home
    home: [
        [btn.home.workers, btn.home.today],
        [btn.home.tasks],
        // [btn.home.sarf_harajat],
        // [btn.home.nizom],
        // [btn.home.offer_complaint],
    ],
    tasks: [btn.tasks.send],
    // today: [
    //     [btn.today.start, btn.today.end],
    //     [btn.today.late],
    //     [btn.today.not_start],
    //     [btn.today.queue],
    //     ['Ortga qaytish 🔙']
    // ],
    // nizom: [
    //     [{ text: 'Tanishdim ✅', callback_data: 'accept' }]
    // ]
}
