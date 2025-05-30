const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const sequenceSchema = Schema({
    from: {

    },
    to: {

    },
    amount: {

    },
    transactionDate: {

    },
    wallet: {

    },
    SCPTWei: {

    },
    fee: {

    },
    type: {

    },
    height: {

    }



})



module.exports = mongoose.model('Stake', sequenceSchema, 'Stake')
