const orderModel =require('../models/OrderModel')
const cartModel=require('../models/CartModel')

module.exports={


placeOrder:(user,orders)=>{
 return new Promise (async(resolve,reject)=>{

const isOrder=await orderModel.findOne({user})

if(isOrder){



const placeOrder= await orderModel.updateOne({user},{$addToSet:{orders}})
cartModel.updateOne({user},{$set:{cartItem:[]}}).then(res=>{
return resolve(placeOrder)

})



}else{



   
    const newOrder = new orderModel({ user, orders})
   const savedOrder =await newOrder.save();
   cartModel.updateOne({user},{$set:{cartItem:[]}}).then(res=>{
    return resolve(savedOrder)
    
    })
    return resolve({ 'response': 'Order Placed' })


}



 })



},

getOrders:(user)=>{

return new Promise (async(resolve,reject)=>{

    const order=await orderModel.findOne({user})
return resolve(order)

})


}



}