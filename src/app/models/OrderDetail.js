const mongoose= require('mongoose')
const Schema= mongoose.Schema;


const OrderDetail = new mongoose.Schema({
    OrderID:{
        type: Schema.Types.ObjectId,
        ref:'order'
    },
    IDproduct:{
        type:Schema.Types.ObjectId,
        ref:'product',
    },
    price:{
        type:Number,
        default:0
    },
    quantity:{
        type:Number,
        required:true,
        default:'0'
    },
    total: {
        type: Number,
        default:0
    }

})
module.exports=mongoose.model('orderDetail', OrderDetail)