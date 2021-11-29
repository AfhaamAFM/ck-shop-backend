const router = require('express').Router()
const { addProduct, viewProduct, deleteProduct, editProduct, filterProductbyCategory, filterProductbySubCategory, searchProduct } = require('../helpers/ProductHelpers');
const { cloudinary } = require('./utils/cloudinary')

// multer confogure
var multer = require('multer');
const { response } = require('express');
let storage = multer.diskStorage({})
let upload = multer({ storage })


// view product start

router.get('/', (req, res) => {
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
// Filter product by category start


router.get('/filter/:category',(req,res)=>{

filterProductbyCategory(req.params.category).then((response)=>{

res.json(response)

})

})

router.get('/subfilter/:category/:subCat',(req,res)=>{

const {category,subCat}=req.params
filterProductbySubCategory(category,subCat).then((response)=>{
console.log('dsd');
res.json(response)

}).catch(err=>{

console.error(err+"  filter by subcategory");

})
})



// filter products by cateogry end


// Search by keyword start

router.get('/Searchfilter/:word',(req,res)=>{

console.log(req.params.word);
searchProduct(req.params.word).then((response)=>{
    
    res.json(response)
    
    }).catch(err=>{
    
    console.error(err+"  filter by search");
    
    })
    })

// search product by keyword end

module.exports = router