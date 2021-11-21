const mongoose = require('mongoose'); 
const Schema=mongoose.Schema;


const Accounts = new Schema({
    userName:{type: String, required: true },
    passWord:{type: String },
    active:{type: String},
    IDUser:{type: Object},
    profilePicture:{
        type:String
    },
    follows:{
        type:Array,
        default:[{user:''}]
    },
    role: {
        type: String,
        enum: ["user", "admin", "sales"],
        default: "user",
      },
})
module.exports=mongoose.model('accounts', Accounts)