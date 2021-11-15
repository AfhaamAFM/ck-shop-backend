const mongoose = require('mongoose')

const categoriesSchema = new mongoose.Schema({
    
    category: { type: String, required: true },
    subCat:{type:Array,required:true}
})

const newCategory = mongoose.model('category', categoriesSchema)

module.exports=newCategory