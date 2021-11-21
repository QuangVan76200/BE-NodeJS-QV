const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    postImage:{
        type:String,
    },
    status: {
        type: String,
        enum: ['Normal Post', 'Sales Post']
    },
    IDUser: {
        type: Schema.Types.ObjectId,
        ref: 'accounts'
    },
    likes:{
        type:Array,
        default:Array(0)
    },

},{
    timestamps: true
})



module.exports = mongoose.model('post', Post)