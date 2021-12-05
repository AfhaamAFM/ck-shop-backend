const router = require("express").Router();
const { response } = require("express");
const jwt = require("jsonwebtoken");
const { placeOrder, getOrders, getAllOrders, changeOrderStatus, userCancelOrder, payForOrder } = require("../helpers/orderHelpers");
const Mongoose = require('mongoose')
const ObjectId = Mongoose.Types.ObjectId
const Razorpay = require('razorpay')
const shortid = require('shortid')
// ====================GET ORDER START================================

router.get('/', (req, res) => {
    try {

        const token = req.cookies.userToken
        if (!token) {

            return res.json({ 'response': 'User not logged in' })
            console.log('JKBJKBHJD');
        }
        const { user } = jwt.verify(token, process.env.JWT_SECRET_USER)
        if (!user) {
            console.log('dsdsdsd');

            return res.json({ 'response': 'User not verified' })
        }

        getOrders(user).then(response => {

            res.json(response)

        })


    } catch (error) {


        console.log('this is fetch cart error  ' + error);
    }




})

// ====================GET ORDER END=================================

// Get all orders start

router.get('/all', (req, res) => {

    try {


        getAllOrders().then(response => {


            res.json(response)
        })

    } catch (error) {

        console.log('this is get all order error ' + error);

    }





})



// get all orders end


//========================================= Place order start=====================
router.post('/user/placeOrder', (req, res) => {

    try {

        const token = req.cookies.userToken
        if (!token) {

            return res.json({ 'response': 'User not logged in' })
            console.log('JKBJKBHJD');
        }
        const { user } = jwt.verify(token, process.env.JWT_SECRET_USER)
        if (!user) {
            console.log('dsdsdsd');

            return res.json({ 'response': 'User not verified' })
        }







        const { amount, address, paymentMethod, orderStatus, cartItems } = req.body

        const { cartItem, cartProduct } = cartItems

        let orderItem = []
        let orderProduct = {}
        cartItem.map((value, i) => {

            let index = cartProduct.findIndex(item => item._id === value.product);
            orderProduct.productId = value.product
            orderProduct.price = value.price
            orderProduct.size = value.size
            orderProduct.quantity = value.quantity
            orderProduct.name = cartProduct[index].name
            orderProduct.category = cartProduct[index].category
            orderProduct.subCat = cartProduct[index].subCat
            orderProduct.image = cartProduct[index].imageUrl[0].img

            orderItem.push(orderProduct)
        })
        const orderId = new ObjectId()
        const orders = { amount, address, paymentMethod, orderStatus, orderItem, orderId }

        placeOrder(user, orders).then(response => {


            res.json(response)
        })

    } catch (error) {
        console.log('This is a place order error ' + error);
    }



})

// =========================place oerder end============================
// Change order status start

router.post('/changeStatus', (req, res) => {

    try {

        const { user, orderId, orderStatus } = req.body


        changeOrderStatus(user, orderId, orderStatus).then(respone => {

            res.json(response)


        })


    } catch (error) {


        console.log('this is change order status errpr ' + error);
    }



})

// change order status end

// user cancel order start

router.get('/user/cancelOrder/:orderId', (req, res) => {

    try {
        const orderId = req.params.orderId
        const token = req.cookies.userToken
        if (!token) {

            return res.json({ response: 'user not logged in' })


        }
        const { user } = jwt.verify(token, process.env.JWT_SECRET_USER)

        if (!user) {

            return res.json({ response: 'user not verified' })
        }

        userCancelOrder(user, orderId).then(response => {


            res.json(response)

        })
    } catch (error) {


        console.error('this is user cancel order error ' + error);

    }



})

// user cancel order end



//@desc : pay with razorapy
//@route : /order/razorpay/payAmount
//@access : private
var razorpay = new Razorpay({
    key_id: 'rzp_test_ZanWOoH710Fanr',
    key_secret: '5NghM8DqAGrhnAXspLtqV4yc',
});

router.get('/razorpay/payAmount', async (req, res) => {
    console.log('reached');
    const options = {
        amount: 50000,
        currency: "INR",
        receipt: shortid.generate(),


    }
    const response = await razorpay.orders.create(options)
    console.log(response)
    res.json({
        id: response.id,
        currency: response.currency,
        amount: response.currency
    })


})

//@desc : Pay order confirmation
//@route : /order/paypal/payAmount
//@access : private


router.post('/:orderId/pay-amount', (req, res) => {

    try {


  
            const orderId = req.params.orderId
            const token = req.cookies.userToken
            if (!token) {

                return res.json({ response: 'user not logged in' })


            }
            const { user } = jwt.verify(token, process.env.JWT_SECRET_USER)

            if (!user) {

                return res.json({ response: 'user not verified' })
            }


const {paymentId,paymentMethod}=req.body
            payForOrder(user,orderId,paymentId,paymentMethod).then(response=>{

               res.json(response)
            })

        } catch (error) {

            console.error('this the order payment error + ' + error);
        }
    })


module.exports = router