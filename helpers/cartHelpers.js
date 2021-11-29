const Mongoose = require('mongoose')
const { log } = require('npmlog')
const cartModel = require('../models/CartModel')
const productModel = require('../models/productModel')
const ObjectId = Mongoose.Types.ObjectId


module.exports = {


    addToCart: (user, cartItem) => {

        return new Promise(async (resolve, reject) => {
console.log('VANATHHH 3',user,cartItem);
            const { product, price, quantity, size } = cartItem
            const existCart = await cartModel.findOne({ user })


            if (existCart) {

                const isProduct = await cartModel.findOne({ user, 'cartItem.product': product })


                if (isProduct) {


                    const isProductSize = await cartModel.findOne({ user, 'cartItem.product': product, 'cartItem.size': size })

                    if (isProductSize) {

                        const addedProduct = await productModel.findOne({ _id: product })
                        const b = isProductSize.cartItem.find(v => v.size === size)
                        const cartItemId=b._id
                        if (b.quantity === addedProduct[size])
                        {
                            return resolve({ 'response': 'You added all the product in the stock' })

                        }else {
                            const incrementquantity = await cartModel.updateOne({ user, 'cartItem._id': cartItemId }, { $inc: { 'cartItem.$.quantity': 1 } })

                            return resolve({ 'response': 'quantity increased by 1',incrementquantity })
                        }
                       
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

    deleteCart:(_id,cartId)=>{

return new Promise (async(resolve,reject)=>{

console.log(_id);

const isExist = await cartModel.findOne({user:_id})

if(!isExist){

return resolve({response:'Item not found'})
}
cartModel.updateOne({'cartItem._id':cartId},{$pull:{'cartItem':{'_id':cartId}}}).then(res=>{


console.log('Thiss',res);

return resolve(true)

}).catch(err=>{



console.log('This is a delete cart error '+err);
})




})  },

getCartItems:(user)=>{

    return new Promise(async(resolve,reject)=>{

const isCart =await cartModel.findOne({user})

if(!isCart){

    console.log('No CART');
    const newCart = new cartModel({ user})
    await newCart.save();

    const isCart =await cartModel.findOne({user})    
    return resolve(isCart)
  
}


const cartItem= await cartModel.aggregate([
    {$match:{ user:ObjectId(user) } },
 
    {$lookup:{from:'products',localField:"cartItem.product",foreignField: '_id',as:'cartProduct'}}
])

resolve(cartItem[0]);




    })

}








  












}