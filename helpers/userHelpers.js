const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");


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

editAddress:(_id,addressId,address)=>{

    
    return new Promise(async( resolve,reject)=>{
    
    const userExist =await userModel.findOne({_id})
    
    if(!userExist){
    
    
        return resolve({response:'User not found'})
    }
    
    
    
         userModel.updateOne({_id,'address._id':addressId}, { $set: { "address.$":address   } }).then(res=>{
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

},


// PROFILE ADDRESS ADD END
editUser:(_id,name,email)=>{

return new Promise ((resolve,reject)=>{

userModel.updateOne({_id},{$set:{name,email}}).then((res)=>{

resolve(true)

}).catch(err=>{


    console.log('this is a user edit error '+err);
})


})
},


// Change Password strat

changePassword:(_id,password,oldPassword)=>{

return new Promise(async(resolve,reject)=>{

  const existUser =await userModel.findOne({_id})

const {passwordHash:existPassword}=existUser
const passwordVerify = await bcrypt.compare(oldPassword, existPassword);

if(!passwordVerify){


  return  resolve({response:'Incorrect password'})
}

const salt = await bcrypt.genSalt();
const passwordHash = await bcrypt.hash(password, salt);

userModel.updateOne({_id},{$set:{passwordHash}}).then(res=>{
return resolve(true)
})

})




}








}