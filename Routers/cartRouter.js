const router = require("express").Router();
const { addToCart } = require("../helpers/cartHelpers");

router.get('/',(req,res)=>{

res.send('dsdsdsd')


})

// ==================ADD TO CART  START====================
router.post('/add',(req,res)=>{
try {
const{user,cartItem}=req.body
addToCart(user,cartItem).then(response=>{

console.log(response);
    res.json(response)




}).catch(err=>{


    console.log('the address added error '+ err);
})





} catch (error) {
    console.log('the address added error '+ error);
}




})





// =====================Add to cart end==============================








module.exports=router