const timezone = require('moment-timezone')

module.exports = {
    toDate(mongoDate) {
        let tz = timezone(mongoDate)

        return tz.tz('America/Sao_Paulo').format('DD/MM/YYYY')
    },

    toDateAndTime(mongoDate) {
        let tz = timezone(mongoDate)

        return tz.tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm')
    }
}