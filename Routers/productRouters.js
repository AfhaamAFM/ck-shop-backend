const router = require('express').Router()
const { addProduct, viewProduct, deleteProduct } = require('../helpers/ProductHelpers');
const { cloudinary } = require('./utils/cloudinary')

// multer confogure
var multer = require('multer');
let storage = multer.diskStorage({})
let upload = multer({ storage })


// view product start

router.get('/', (req, res) => {
    console.log('recdhed add product');
    viewProduct().then((response) => {
        res.json(response)
    })

})

// view product end

// add product start
router.post('/add', (req, res) => {

    
    
    addProduct(req.body).then(response => {
        res.json(response)
    })
})
// add product end
// delete product start

router.get('/delete/:id', (req, res) => {
    console.log('reached delte');
    deleteProduct(req.params.id).then(response => {


        res.json(response)
    })

})
// deletr product end
//  product image start
// 
router.post("/addImage", upload.array("image"), async (req, res) => {
    try {


        let files = req.files;
        let imageUrl = []


        let count = 0;


        for (let file of files) {
            const uploadResponse = await cloudinary.uploader.upload(file.path, {
                upload_preset: 'fnpbm7gw'
            })
            pos = `image${count}`
          
            count++;
            imageUrl.push({
                img:uploadResponse.secure_url
            });
            if (count === 4) {

                 
                    res.json(imageUrl);

            }
        }


       

    } catch (e) {
        console.log('cloudinary error' + e.message);
    }

    //console.log(files);


})

// add image end
// add product start


// /add product end
module.exports = router