const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Order = new mongoose.Schema({
    OrderID: {
        type: Object
    },
    IDUser: {
        type: Schema.Types.ObjectId,
        ref: 'accounts'
    },

    IDproduct: {
        type: Schema.Types.ObjectId,
        ref: 'product',
    },

    adress: {
        type: String
    },
    status: {
        type: String,
        default: "pendding"
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('order', Order)