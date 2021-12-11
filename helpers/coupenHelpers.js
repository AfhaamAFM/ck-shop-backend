const coupenModel =require('../models/coupenModel')

module.exports={

addCoupen:(nam,expiry,percentage)=>{
const name= nam.toUpperCase()
    const expiryDate= new Date(expiry)
return new Promise(async(resolve,reject)=>{

if (percentage < 1 || percentage > 99) {
    return resolve({ warning: 'The percentage exceedas limit' })
}
let currentDate = new Date()
if (expiryDate < currentDate) {

    return resolve({ warning: 'The Date is invalid' })
}

const existCoupen = await coupenModel.findOne({name})

if (existCoupen) {
    return resolve({ warning: 'A name with this offer exists' })
}


const newCoupen = new coupenModel({ name, expiryDate, percentage })
await newCoupen.save()
return resolve(true)


})


},
fetchCoupen: () => {
    return new Promise(async(resolve, reject) => {

        const offers = await coupenModel.find({})
        return resolve(offers)


    })


},

deleteCoupen:(_id)=>{

return new Promise(async (resolve,reject)=>{

const isCoupen =await coupenModel.findOne({_id})

if(!isCoupen){

    return resolve ({warning:'No coupen found'})
}

await coupenModel.deleteOne({_id}).then(res=>{

    resolve(true)
})


})


}




}