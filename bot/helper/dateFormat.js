const { format, getHours, getMinutes } = require("date-fns");

const dateFormat = (date) => {
    if (date) {
        return format(new Date(date), "MM-dd-yyyy")
    } else {
        return format(new Date(), "MM-dd-yyyy")
    }
}
const hoursFormat = (date) => {
    if (date) {
        return format(new Date(date))
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

const dateHM = (date) => {
    if (date) {
        return format(new Date(date), 'HH:mm')
    } else {
        return format(new Date(), 'HH:mm')
    }
}

const dateYHM = (date) => {
    if (date) {
        return format(new Date(date), "MM-dd-yyyy HH:mm")
    } else {
        return format(new Date(), "MM-dd-yyyy HH:mm")
    }
}

module.exports = {
    dateFormat, hoursFormat, minutesFormat, dateYHM, dateHM
}