const offerModel =require('../models/offerModel')

module.exports={


    // add offer start

addOffer:(offerName,expiryDate,percentage)=>{

return new Promise(async(resolve,reject)=>{

if(percentage<1||percentage>99){
    return resolve({warning:'The percentage exceedas limit'})
}
let currentDate =new Date()
if(expiryDate<currentDate){

    return resolve({warning:'The Date is invalid'})
}

const isOffer =await offerModel.findOne({offerName})
console.log(isOffer);

if(isOffer)
{
    return resolve ({warning:'A name with this offer exists'})
}


const newOffer = new offerModel({offerName,expiryDate,percentage})
await newOffer.save()
return resolve(true)


})

},

    // add offer end

// Get all offers from start 

fetchOffer:()=>{
    return new Promise (async(resolve,reject)=>{
    
    const offers = await offerModel.find({})
   return resolve(offers)
    
    
    })
    
    
    }
    
    
    //  get all offers end












}