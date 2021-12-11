const mongoose = require('mongoose')

const categoriesSchema = new mongoose.Schema({
    
    category: { type: String, required: true },
    subCat:{type:Array,required:true},
    isOffer:{type:Boolean,required:true,default:false},
    offer: {
        offerName: { type: String },
        offerType: { type: String },
        offerId: { type: mongoose.Schema.Types.ObjectId },
        percentage: { type: Number },
        expiryDate: { type: Date },

    }

})

const newCategory = mongoose.model('category', categoriesSchema)

module.exports=newCategory