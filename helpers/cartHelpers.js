const Mongoose = require('mongoose')
const { log } = require('npmlog')
const cartModel = require('../models/CartModel')
const productModel = require('../models/productModel')
const ObjectId = Mongoose.Types.ObjectId


module.exports = {


    addToCart: (user, cartItem) => {

        return new Promise(async (resolve, reject) => {

            const { product, price, quantity, size } = cartItem
            const existCart = await cartModel.findOne({ user })


            if (existCart) {

                const isProduct = await cartModel.findOne({ user, 'cartItem.product': product })


                if (isProduct) {


                    const isProductSize = await cartModel.findOne({ user, 'cartItem.product': product, 'cartItem.size': size })

                    if (isProductSize) {

                        const addedProduct = await productModel.findOne({ _id: product })

                        const b = isProductSize.cartItem.find(v => v.size === size)
                        if (b.quantity === addedProduct[size])
                            return resolve({ 'response': 'You added all the product in the stock' })


                        const incrementquantity = await cartModel.updateOne({ user, 'cartItem.product': product }, { $inc: { 'cartItem.$.quantity': 1 } })
                        return resolve({ 'response': 'quantity increased by 1' })

                    }


                }


                // Diffrent size or product

                cartModel.updateOne({ user }, { $addToSet: { cartItem } }).then(res => {

                    return resolve({ 'response': 'Product added to cart' })

                }).catch(err => {

                    console.log(err);
                })



            } else {

                console.log('No CART');
                const newCart = new cartModel({ user, cartItem })
                await newCart.save();
                return resolve({ 'response': 'Product added to cart' })
            }

        })
    },

    deleteCart:(_id)=>{

return new Promise (async(resolve,reject)=>{



const isExist = await cartModel.findOne({_id})

console.log(isExist);
if(!isExist){

return resolve({response:'Item not found'})
}

cartModel.deleteOne({_id}).then(res=>{

return resolve(true)

}).catch(err=>{



console.log('This is a delete cart error '+err);
})




})








    }












}