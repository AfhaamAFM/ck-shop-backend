const offerModel = require('../models/offerModel')
const productModel = require('../models/productModel')


module.exports = {


    // add offer start

    addOffer: (offerName, expiryDate, percentage) => {

        return new Promise(async (resolve, reject) => {

            if (percentage < 1 || percentage > 99) {
                return resolve({ warning: 'The percentage exceedas limit' })
            }
            let currentDate = new Date()
            if (expiryDate < currentDate) {

                return resolve({ warning: 'The Date is invalid' })
            }

            const isOffer = await offerModel.findOne({ offerName })
            console.log(isOffer);

            if (isOffer) {
                return resolve({ warning: 'A name with this offer exists' })
            }


            const newOffer = new offerModel({ offerName, expiryDate, percentage })
            await newOffer.save()
            return resolve(true)


        })

    },

    // add offer end

    // Get all offers from start 

    fetchOffer: () => {
        return new Promise(async (resolve, reject) => {

            const offers = await offerModel.find({})
            return resolve(offers)


        })


    },


    //  get all offers end

    // APPLY product offer start
    applyProductOffer: (_id, offerID) => {



return new Promise(async (resolve, reject) => {
            let discountPrice
            let offerPrice

            const getOfferDetails = await offerModel.findOne({_id:offerID})

            const { offerId, offerType, percentage, expiryDate, offerName } = getOfferDetails 
            const thisProduct = await productModel.findOne({ _id })

           let { isOffer, offer: oldOffer } = thisProduct

            if (isOffer) {
                const { offerId: oldOfferId, offerType: oldOfferType, percentage: oldPercentage, oldxpiryDate, offerName: oldOfferName } = oldOffer

                if (percentage < 1 || percentage > 99) {

                    return resolve({ warning: ` offer of ${percentage} % cannot be applied` })

                }

                const existOffer = await productModel.findOne({ 'offer._id': offerId })
                if (existOffer) {

                    return resolve({ warning: `${offerName} offer  is already applied` })
                }


                if (oldPercentage > percentage) {


                    return resolve({ warning: `There is a higher offer of ${oldPercentage} % applied` })
                }

                const { price } = thisProduct
                discountPrice = price * (percentage / 100)
                offerPrice = price - discountPrice

               productModel.updateOne({ _id }, { $set: { offer:getOfferDetails ,offerPrice, discountPrice } }).then(res => {
                    if (res.modifiedCount) {

                        return resolve({ response: `Offer applied of ${percentage} %` })
                    }


                }).catch(err => {


                    console.log(err);
                })






            } else {

                const { price } = thisProduct
                discountPrice = price * (percentage / 100)
                offerPrice = price - discountPrice

                productModel.updateOne({ _id }, { $set: { offer:getOfferDetails , isOffer: true, offerPrice, discountPrice } }).then(res => {


                    if (res.modifiedCount) {

                        return resolve({ response: `Offer applied of ${percentage} %` })
                    }

                })


            }

        })


    }

    // Apply product offer end










}