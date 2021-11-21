const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
     text:{
         type: String
     },
     Post:{
        type: Schema.Types.ObjectId,
        ref: 'post'
     },
     IDUser: {
        type: Schema.Types.ObjectId,
        ref: 'accounts'
    }
},{
    timestamps:true,
})

module.exports = mongoose.model('comment', Comment)