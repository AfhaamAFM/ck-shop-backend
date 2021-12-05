// Importing modules
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { urlencoded } = require('express')
const app = express()
const fileupload = require('express-fileupload');
const cloudinary =require('./Routers/utils/cloudinary')
dotenv.config()


app.use(express.json({limit:'50mb'}))
// app.use(fileupload());
app.use(express.urlencoded({ extended: true,limit:'50mb' }))
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
    origin: ['http://localhost:3000', 'http://localhost:3001','http://localhost:3002'],
    credentials: true
}));

// set the Routes
app.use('/user', require('./Routers/userRouter'))
app.use('/admin', require('./Routers/adminRouter'))
app.use('/admin/product',require('./Routers/productRouters'))
app.use('/user/cart/',require('./Routers/cartRouter'))
app.use('/order/',require('./Routers/orderRouter'))
app.use('/offer',require('./Routers/offerRouter'))

app.get('/', (req, res) => {
    res.send('hello')
})
 app.get('/config/paypal',(req,res)=>res.send(process.env.PAYPAL_CLIENT_ID))


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server start at port ${PORT}`);
})
