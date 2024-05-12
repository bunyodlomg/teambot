const { format, getHours, getMinutes } = require("date-fns");

const dateFormat = (date) => {
    if (date) {
        return format(new Date(date), "yyyy-MM-dd")
    } else {
        return format(new Date(), "yyyy-MM-dd")
    }
}
const hoursFormat = (date) => {
    if (date) {
        return getHours(new Date(date))
    } else {
        return getHours(new Date())
    }
}
const minutesFormat = (date) => {
    if (date) {
        return getMinutes(new Date(date))
    } else {
        return getMinutes(new Date())
    }
}


module.exports = {
    dateFormat, hoursFormat, minutesFormat
}