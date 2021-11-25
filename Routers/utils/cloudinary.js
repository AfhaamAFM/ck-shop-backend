require('dotenv').config()
var cloudinary = require('cloudinary').v2
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
    // cloud_name: 'afhaamcloud', 
    // api_key: '512216432759182', 
    // api_secret: 'H1LTDxwukyte9KLqwHMS3eiriNI'

});
module.exports ={cloudinary}

