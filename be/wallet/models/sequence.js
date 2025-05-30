const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const sequenceSchema = Schema({
    address: {

    },
    sequence: {

    },

})



module.exports = mongoose.model('Sequence', sequenceSchema, 'Sequence')