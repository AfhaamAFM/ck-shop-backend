const router = require("express").Router();
const { addToCart, deleteCart } = require("../helpers/cartHelpers");

router.get('/', (req, res) => {

    res.send('dsdsdsd')


})

// ==================ADD TO CART  START====================
router.post('/add', (req, res) => {
    try {
        const { user, cartItem } = req.body
        addToCart(user, cartItem).then(response => {

            console.log(response);
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