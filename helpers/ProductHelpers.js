const { cloudinary } = require('../Routers/utils/cloudinary')

const productModel = require('../models/productModel')

module.exports = {

    // Add product  start
    addProduct: (product) => {


        return new Promise(async (resolve, reject) => {


            const { name, category, subCat, price, description, small, medium, large, imageUrl } = product
            if (!name || !price || !category || !subCat) {
                return resolve({ response: 'Please fill all' })
            }
            // console.log(product)

            const existProduct = await productModel.findOne({ name })

            if (existProduct) {
                return resolve({ response: 'Product already exist' })
            }
            let quantity = parseInt(small) + parseInt(medium) + parseInt(large)
            // console.log(quantity);


            const newProduct = new productModel({
                name, category, subCat, price, description, small, medium, large, imageUrl, quantity

            })

            newProduct.save().then(() => {
                return resolve(true)
            })

        })
    },

    //Add product end

    // Delete product start

    deleteProduct: (_id) => {
        return new Promise(async (resolve, reject) => {

            const existProduct = await productModel.findOne({ _id })
            console.log(existProduct);
            if (!existProduct) {
                return resolve({ response: 'product is not found' })
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
    },


    // delete product end
    // Edit product start


    editProduct: (product) => {

        return new Promise(async (resolve, reject) => {

console.log('Reached')
            const { name, category, subCat, price, description, small, medium, large, imageUrl, _id } = product

            if (!name || !price || !category || !subCat) {
                return resolve({ response: 'Please fill all' })
            }
            // console.log(product)

       
            let quantity = parseInt(small) + parseInt(medium) + parseInt(large)

console.log(_id);
            const data = await productModel.updateOne({ _id }, {
                $set: {
                    name, category, subCat, price, description, small, medium, large, imageUrl, quantity
                }
            })

            console.log(data);
            resolve(true)

        })
    },
    // edit product end


    // Edit product with category edit
    editProductCat: (category, newCat) => {

        return new Promise((resolve, reject) => {

            productModel.updateMany({ category }, { $set: { category: newCat } }).then(() => {


                resolve(true)
            })


        })
    },



    filterProductbyCategory: (category) => {

        return new Promise(async (resolve, reject) => {


            const existCat = await productModel.findOne({ category })

            if (!existCat) {
                console.log('dasd', existCat);

                return resolve({ response: `No item found in ${category}` })
            }

            productModel.find({ category }).then((res) => {

                resolve(res)

            }).catch((err) => {
                console.error(err);
            })

        })



    },


    filterProductbySubCategory: (category, subCat) => {

        return new Promise(async (resolve, reject) => {


            const existCat = await productModel.findOne({ category, subCat })

            if (!existCat) {
                console.log('dasd', existCat);

                return resolve({ response: `No item found in ${category}'s  ${subCat}' ` })
            }

            productModel.find({ category, subCat }).then((res) => {

                resolve(res)

            }).catch((err) => {
                console.error(err);
            })

        })
    },

    //  Search product start

    searchProduct: (word) => {

        return new Promise((resolve, reject) => {

            productModel.find({ name: { $regex: word, $options: 'i' } }).then(res => {
                console.log(res);
                resolve(res)


            })



        })
    },
    uploadImage: (imageHere,public_id) => {

        try {
            console.log('reached image uplod helpers');
            return new Promise(async (resolve, reject) => {
                console.log('reached here');
                if(public_id){
                await  cloudinary.uploader.destroy(public_id, function(error,result) {
                    console.log(result, error) });  
                }
    
    
                cloudinary.uploader.upload(imageHere, {
                    upload_preset: 'fnpbm7gw'
                }).then(response => {
    
                    const { public_id, url:img } = response
    
                    const image = { public_id, img }
                    resolve(image)
            
                }).catch(err => {
                    console.log('this is the error form product helpers eror clodinfnaty' + err);
    
    
                })
    
    
            })
        } catch (error) {
            console.log('this is the error form product helpers eror clodinfnaty' + error);

        }
       
    }


    // Search product end

}
