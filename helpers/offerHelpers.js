const offerModel =require('../models/offerModel')
const productModel=require('../models/productModel')


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
    
    
    },
    
    
    //  get all offers end

// APPLY product offer start
applyProductOffer:(_id,offer)=>{

return new Promise(async (resolve,reject)=>{
const {offerId,offerType,percentage,expiryDate,offerName}=offer
    const thisProduct =await productModel.findOne({})

const {isOffer,offer:oldOffer}=thisProduct

if(isOffer){
    const {offerId:oldOfferId,offerType:oldOfferType,percentage:oldPercentage,oldxpiryDate,offerName:oldOfferName}=oldOffer

if(percentage<1||percentage>99){

    return resolve ({response:` offer of ${percentage} % cannot be applied`})

}

if (oldOfferId===offerId){

    return resolve ({response:`${offerName}  is already here`})

}

if(oldPercentage>percentage){


    return resolve ({response:`There is a higher offer of ${oldPercentage} % applied`})
}

const updatedOffer= productModel.updateOne({_id},{$set:{offer}}).then(res=>{
console.log(offer);


}).catch(err=>{


    console.log(err);
})


    



}else{

productModel.updateOne({_id},{$set:{offer,isOffer:true}}).then(res=>{

   if (res.modifiedCount){

return resolve({response:`Offer applied of ${percentage} %`})
   }
    
})


}

})


}

// Apply product offer end










}