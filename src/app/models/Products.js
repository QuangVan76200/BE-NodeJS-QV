const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Product = new mongoose.Schema({
    IDproduct: {
        type: Object
    },
    IDUser: {
        type: Schema.Types.ObjectId,
        ref: 'accounts'
    },
    title: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        require: true
    },
    productImage: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    currency: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('product', Product)