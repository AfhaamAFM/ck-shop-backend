const router = require('express').Router()
const { addProduct, viewProduct, deleteProduct, editProduct, filterProductbyCategory, filterProductbySubCategory, searchProduct, uploadImage } = require('../helpers/ProductHelpers');
const { cloudinary } = require('./utils/cloudinary')
const jwt = require('jsonwebtoken')
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

//@desc : Edit proudct
//@route : /admin/product/edit
//@access : private

router.post('/edit',(req,res)=>{

try {
    editProduct(req.body).then(response => {
        res.json(response)
    })
    
} catch (error) {
    
console.error('This is the product edit error  '+ error)
}


})



router.get('/delete/:id', (req, res) => {
    console.log('reached delte');
    deleteProduct(req.params.id).then(response => {


        res.json(response)
    })

})
// deletr product end
//  product image start
// 
router.post("/uploadImage", async (req, res) => {
    try {
        const token = req.cookies.userToken
        if (!token) {

            return res.json({ response: 'user not logged in' })


        }
        const { user: _id } = jwt.verify(token, process.env.JWT_SECRET_USER)

        if (!_id) {

            return res.json({ response: 'user not verified' })
        }
        const { image: imageHere } = req.body
        
        const {public_id} =req.query;

        uploadImage(imageHere,public_id).then(response => {

            res.json(response)
        })




    } catch (e) {
        console.log('cloudinary error' + e.message);
        res.json({ error: e })
    }

    //console.log(files);


})



// add image end
// add product start


// /add product end
// Filter product by category start


router.get('/filter/:category', (req, res) => {

    filterProductbyCategory(req.params.category).then((response) => {

        res.json(response)

    })

})

router.get('/subfilter/:category/:subCat', (req, res) => {

    const { category, subCat } = req.params
    filterProductbySubCategory(category, subCat).then((response) => {
        console.log('dsd');
        res.json(response)

    }).catch(err => {

        console.error(err + "  filter by subcategory");

    })
})



// filter products by cateogry end


// Search by keyword start

router.get('/Searchfilter/:word', (req, res) => {

    console.log(req.params.word);
    searchProduct(req.params.word).then((response) => {

        res.json(response)

    }).catch(err => {

        console.error(err + "  filter by search");

    })
})

// search product by keyword end

// Image upload

module.exports = router
