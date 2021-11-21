const mongoose = require('mongoose');

//Ham Connect Database

//await c async
async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/Cap1');
        userNewUrlParser: true;
        userUnifiedTopology: true;
        useCreateIndex:true;

        console.log('succesfully');
    } catch (error) {
        console.log('fail');
    }
}
module.exports = { connect };