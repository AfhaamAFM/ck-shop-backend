const userModel = require("../models/userModel");


module.exports ={


// PROFILE ADDRESS ADD START

addAddress:(_id,address)=>{

    
return new Promise(async( resolve,reject)=>{

const userExist =await userModel.findOne({_id})

if(!userExist){


    return resolve({response:'User not found'})
}



     userModel.updateOne({_id},{$push:{address}}).then(res=>{
 return resolve(res.acknowledged);

     }).catch(err=>{

console.log(err);

     })
   
    })





},

deleteAddress:(_id,addressId)=>{


    return new Promise((resolve,reject)=>{

userModel.updateOne({_id},{$pull:{address:{_id:addressId}}}).then((res)=>{


resolve(res.acknowledged)

})


    })

}





// PROFILE ADDRESS ADD END









}