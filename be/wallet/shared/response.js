const res = require('./res');


module.exports = {
    sendSuccess: function (message, data) {
        data = data || null
        return Object.assign({}, res, {
            success: true,
            message: message,
            data: data
        });

    },
    sendError: function (message, data) {
        data = data || null
        return Object.assign({}, res, {
            message: message,
            data: data
        });
    }
}