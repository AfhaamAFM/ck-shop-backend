const { addOffer, fetchOffer, applyProductOffer, removeOffer } = require('../helpers/offerHelpers')

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







module.exports =router