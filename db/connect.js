const mongoose = require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log('MongoDB Connected!');
}).catch((err)=>{
    console.log('MongoDB Connection Failed',err)
})

