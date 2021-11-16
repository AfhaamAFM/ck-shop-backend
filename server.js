// Importing modules
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
dotenv.config()



mongoose.connect(process.env.MDB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}, (err) => {
    if (err) return console.log(err);
    console.log('Connected Database')
})

    // mongoose.connect(process.env.MDB_CONNECT, {

    //     useNewUrlParser: true,
    //     useUnifiedTopology:true,
    // }, (err) => {
    //     if (err) return console.log(err);
    //     console.log("connected monogDB");
    // })




// app middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:3000','http://localhost:3001'],
    credentials:true
}));

// set the Routes
app.use('/user',require('./Routers/userRouter'))
app.use('/admin',require('./Routers/adminRouter'))



app.get('/', (req, res) => {
    res.send('hello')
})

const PORT = process.env.PORT||5000;
app.listen(PORT, () => {
    console.log(`server start at port ${PORT}`);
})
