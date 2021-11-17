// Importing modules
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { urlencoded } = require('express')
const app = express()
const fileupload = require('express-fileupload');
const { cloudinary } = require('./Routers/utils/cloudinary')

dotenv.config()


app.use(express.json({}))
// app.use(fileupload());
app.use(express.urlencoded({ extended: true }))
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
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// set the Routes
app.use('/user', require('./Routers/userRouter'))
app.use('/admin', require('./Routers/adminRouter'))



app.get('/', (req, res) => {
    res.send('hello')
})

var multer = require('multer');
let storage = multer.diskStorage({})
let upload = multer({ storage })

app.post("/demo", upload.array("image"), async (req, res) => {
    try {
        console.log("Demo");

        let files = req.files;

        // console.log(files);

        let arr = [];
        let count = 0;


        for (let file of files) {
            console.log(1);
            const uploadResponse = await cloudinary.uploader.upload(file.path, {
                upload_preset: 'fnpbm7gw'
            })
            console.log(2);
            count++;
            arr.push(uploadResponse.secure_url);
            if (count === 3) {
console.log('herererer'+arr)
                res.json(arr);
                
            }
        }

    } catch (e) {
        console.log('cloudinary error'+e.message);
    }

    //console.log(files);


})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server start at port ${PORT}`);
})
