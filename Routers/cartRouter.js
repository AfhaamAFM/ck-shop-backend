const router = require("express").Router();
const { addToCart, deleteCart, getCartItems } = require("../helpers/cartHelpers");
const jwt = require("jsonwebtoken");



//========================================== GET CART ITEMS START=======================================

router.get('/', (req, res) => {

    try {

        const token = req.cookies.userToken
          if(!token){
          
            return res.json({'response':'User not logged in'})
            console.log('JKBJKBHJD');
          }
          const {user} = jwt.verify(token, process.env.JWT_SECRET_USER)
          if (!user)
          {
            console.log('dsdsdsd');

          return  res.json({'response':'User not verified'})
          }


getCartItems(user).then(response=>{

res.json(response)


}).catch(err=>{


    console.log('this is a get cart item '+error);


})


        
    } catch (error) {
        

        console.log('this is a get cart item '+error);
    }


})





// ==========================================GET CART ITEMS END=========================================


// ==================ADD TO CART  START====================
router.post('/add', (req, res) => {
    try {





        const token = req.cookies.userToken
          if(!token){
          
            return res.json({'response':'User not logged in'})
            console.log('JKBJKBHJD');
          }
          const {user} = jwt.verify(token, process.env.JWT_SECRET_USER)
          if (!user)
          {
            console.log('dsdsdsd');

          return  res.json({'response':'User not verified'})
          }








        const {product,size,price } = req.body
        const cartItem={product,size,price }
        addToCart(user, cartItem).then(response => {

            res.json(response)




        }).catch(err => {


            console.log('the address added error ' + err);
        })





    } catch (error) {
        console.log('the address added error ' + error);
    }




})





// =====================Add to cart end==============================

// =================================================DELETE CART START====================================

router.get('/delete/:id', (req, res) => {

    try {

        const id = req.params.id

        deleteCart(id).then((response) => {
res.json(response)

        }).catch(err => {
            console.log('This is a delete error 1' + error);
        })

    } catch (error) {
        console.log('This is a delete error ' + error);
    }

})













// =============================================DELETE CART END========================================






module.exports = router