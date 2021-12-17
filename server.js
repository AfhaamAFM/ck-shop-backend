// Importing modules
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const cloudinary =require('./Routers/utils/cloudinary')
const chalk =require('chalk')

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


// app middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:3030', 'http://localhost:3000','http://localhost:8000'],
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
 app.get('/config/razor',(req,res)=>res.send(process.env.RAZOR_CLIENT_ID))



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(chalk.yellowBright(`server start at port ${PORT}`));
})
