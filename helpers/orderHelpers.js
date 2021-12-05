const orderModel =require('../models/OrderModel')
const cartModel=require('../models/CartModel')
const userModel=require('../models/userModel')
const offerModel =require('../models/offerModel')

module.exports={


placeOrder:(user,orders)=>{
 return new Promise (async(resolve,reject)=>{
const isOrder=await orderModel.findOne({user})
const user1 =await userModel.findOne({_id:user})
const {email}=user1
if(isOrder){



const placeOrder= await orderModel.updateOne({user},{$addToSet:{orders}})
    
return resolve(orders.orderId)





}else{



   
    const newOrder = new orderModel({ user, orders,email})
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


},

getAllOrders:()=>{
    console.log('reacccc');
return new Promise (async(resolve,reject)=>{

const allOrders= await orderModel.aggregate([

    {$unwind:'$orders'}
])

resolve(allOrders)

})

},
// Chnage order status

changeOrderStatus:(user,orderId,orderStatus)=>{
    return new Promise(async(resolve,reject)=>{

const setorderStatus =await orderModel.updateOne({user,'orders._id':orderId},{$set:{'orders.$.orderStatus':orderStatus}})
return resolve(setorderStatus.acknowledged);

    })




},

// use cancel order start 

userCancelOrder:(user,orderId)=>{
return new Promise(async(resolve,reject)=>{
console.log(orderId);
console.log(user);
const cancelOrder = await orderModel.updateOne({user,'orders._Id':orderId},{$set:{'orders.$.orderStatus':'canceled'}})
return resolve(cancelOrder.acknowledged)



})


},

// user cancel order end
// pay for order start

payForOrder:(user,orderId,paymentId,paymentMethod)=>{
    return new Promise(async (resolve,reject)=>{
      
        const isOrder =await orderModel.find({user})

        if(!isOrder){
            return resolve ({response:'use order not found'})
        }
    const paymentResult ={

        payId:paymentId,
        payed_Date:new Date(),
        status:'paid'

    }

        orderModel.updateOne({user,'orders.orderId':orderId},{$set:{

            'orders.$.isPaid':true,
            'orders.$.paymentMethod':paymentMethod,
            'orders.$.paymentResult':paymentResult

            
        }}).then(res=>{
            cartModel.findOneAndUpdate({user},{$set:{cartItem:[]}}).then(res=>{

            return resolve(true)
            })
        })
    
    })
}







}