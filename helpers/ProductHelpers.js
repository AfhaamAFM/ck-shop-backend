

const productModel = require('../models/productModel')

module.exports = {

    // Add product  start
    addProduct: (product) => {


        return new Promise(async (resolve, reject) => {


            const {  name, category, subCat, price, description, small, medium, large, imageUrl  } = product

            if (!name || !price || !category || !subCat) {
                return resolve({ response: 'Please fill all' })
            }
            // console.log(product)

            const existProduct = await productModel.findOne({ name })

            if (existProduct) {
                return resolve({ response: 'Product already exist' })
            }
let quantity =parseInt(small)+parseInt(medium)+parseInt(large)
// console.log(quantity);


            const newProduct = new productModel({
               name, category, subCat, price, description, small, medium, large,imageUrl,quantity

            })
console.log('reached');
            newProduct.save().then(() => {
                resolve(true)
            })

        })
    },

    //Add product end

    // Delete product start

    deleteProduct: (_id) => {
        return new Promise(async (resolve, reject) => {

            const existProduct = await productModel.findOne({ _id })
            console.log(existProduct);
if(!existProduct){
    return resolve({response:'product is not found'})
}
            productModel.deleteOne({ _id }).then((res) => {
                resolve(true)
            }).catch(err => {


                reject(err)
            })

        })

    },
    viewProduct: () => {


        return new Promise(async (resolve, reject) => {

            const allProduct = await productModel.find({})

            resolve(allProduct)


        })
    }


    // delete product end

}
