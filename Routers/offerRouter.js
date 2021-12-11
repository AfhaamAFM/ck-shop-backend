const { addCoupen, fetchCoupen, deleteCoupen } = require('../helpers/coupenHelpers')
const { addOffer, fetchOffer, applyProductOffer, removeOffer, applyCategoryOffer, removeCatOffer } = require('../helpers/offerHelpers')

const router =require('express').Router()


router.get('/',(req,res)=>{

try {
    
fetchOffer().then(response=>{
res.json(response)


}).catch(err=>{


    console.error('This is get all offers error  '+err);


})


} catch (error) {
    
    console.error('This is get all offers error  '+error);
}

})

// add product offer router start

router.post('/addOffer',(req,res)=>{
try {

const {offerName,expiryDate,percentage}=req.body
addOffer(offerName,expiryDate,percentage).then(response=>{


    res.json(response)
})

    
} catch (error) {
    
    console.error('this is add product offer error   ' +error);
}

})

// ========================================================Apply product offer================================================

router.post('/applyProductOffer',(req,res)=>{


try {

const{productId,offerId}=req.body


applyProductOffer(productId,offerId).then(response=>{

res.json(response)

})

    
} catch (error) {

    console.error('this is apply product offer error  '+error);
    
}



})

// remove offer from product start
router.get('/removeOffer/:id',(req,res)=>{

try {
    console.log('reeeee');
    
    const id = req.params.id

    removeOffer(id).then(response=>{

res.json(response)

    })


} catch (error) {
    
    console.error('This is delte offer error  '+error);
}


})

// remove offer from product end

router.post('/applyCategoryOffer',(req,res)=>{
try {
    const{offeredCategory,offerId}=req.body
    // console.log(category,offerId)
    const category = offeredCategory
    applyCategoryOffer(category,offerId).then(response=>{
res.json(response)


})

} catch (error) {
    console.log('This ois category offer error  '+error)
}


})


// /offer/removeOffer/category/${categoryId}

router.get('/removeOffer/category/:category',(req,res)=>{

try {
    const category = req.params.category

removeCatOffer(category).then(response=>{


    res.json(response)
})

    
} catch (error) {
    
console.log('this is remove cat offe error  '+ error)

}





})
//=============================cCOUPEN CAN ALSO CAN APPLEID BETWEEN======================================
router.post('/addCoupen',(req,res)=>{
try {
    const{name,expiryDate,percentage}=req.body

addCoupen(name,expiryDate,percentage).then(response=>{

res.json(response)
})

} catch (error) {
    
console.log('This is add coupen error ' +error)

}


})


// get all coupen

router.get('/coupen',(req,res)=>{
    
fetchCoupen().then(response=>{

    res.json(response)
})


})

// delete coupen 

router.get('/coupen/delete/:id',(req,res)=>{
    
  const coupenId = req.params.id
    deleteCoupen(coupenId).then(response=>{
    
        res.json(response)
    })
    
    
    })



module.exports =router