const router = require("express").Router();
const { response } = require("express");
const jwt = require("jsonwebtoken");
const { placeOrder, getOrders, getAllOrders, changeOrderStatus } = require("../helpers/orderHelpers");


// ====================GET ORDER START================================

router.get('/',(req,res)=>{
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

getOrders(user).then(response=>{

res.json(response)

})


} catch (error) {
    

console.log('this is fetch cart error  '+error);
}




})

// ====================GET ORDER END=================================

// Get all orders start

router.get('/all',(req,res)=>{

try {

console.log('reccc');
    getAllOrders().then(response=>{


        res.json(response)
    })
    
} catch (error) {

    console.log('this is get all order error '+error);
    
}





})



// get all orders end


//========================================= Place order start=====================
router.post('/user/placeOrder',(req,res)=>{

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
    
    





const{amount,address,paymentMethod,orderStatus,cartItems}=req.body

const {cartItem,cartProduct}=cartItems

// console.log(cartItem);
// console.log(cartProduct);
    // placeOrder(user,req.body).then(response=>{

    //     res.json(response)
    // })
let orderItem=[]
    let orderProduct={}
    cartItem.map((value, i) => {

        let index=cartProduct.findIndex(item=>item._id===value.product);
orderProduct.productId=value.product
orderProduct.price=value.price
orderProduct.size=value.size
orderProduct.quantity=value.quantity
orderProduct.name=cartProduct[index].name
orderProduct.category=cartProduct[index].category
orderProduct.subCat=cartProduct[index].subCat
orderProduct.image=cartProduct[index].imageUrl[0].img

orderItem.push(orderProduct)
    })

const orders= {amount,address,paymentMethod,orderStatus,orderItem}

    placeOrder(user,orders).then(response=>{


        res.json(response)
    })
        
    } catch (error) {
        console.log('This is a place order error '+error );
    }
    
    
    
    })

// =========================place oerder end============================
// Change order status start

router.post('/changeStatus',(req,res)=>{

try {
const {user,orderId,orderStatus}=req.body


changeOrderStatus(user,orderId,orderStatus).then(respone=>{

res.json(response)


})

    
} catch (error) {
    

    console.log('this is change order status errpr '+error);
}



})

// change order status end









module.exports=router