const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const adminModel = require('../models/adminModel')
const userModel = require('../models/userModel')
const catModel = require('../models/categoryModel')






router.get('/', (req, res) => {
    res.send('hello admin')
})

// ================= ADMIN SIGNUP START +===============================

router.post('/signup', async (req, res) => {
    try
    {
        const { name, password } = req.body

        if (!name || !password)
        {
            return res.status(406).json({ response: "Please fill all" })
        }

        const existAdmin = await adminModel.findOne({ name });
        if (existAdmin)
        {
            return res.status(406).json({ response: 'Admin already exist' })
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt)
        const newAdmin = new adminModel({
            name, passwordHash
        })
        await newAdmin.save();
    } catch (err)
    {
        console.error(err);
    }
})




// ========================ADMIN SIGNUP END===============================================





// ============================== ADMIN SIGNIN START +====-=========================

router.post('/login', async (req, res) => {



    try
    {
        const { name, password } = req.body
        console.log('vannath ' + name, password);
        if (!name || !password)
        {
            return res.status(406).json({ error: 'Please fill All' })
        }

        const existAdmin = await adminModel.findOne({ name })
        if (!existAdmin)
        {
            return res.status(406).json({ response: 'Admin not Found' })
        }

        const { passwordHash } = existAdmin
        const passwordVerify = await bcrypt.compare(password, passwordHash)
        if (!passwordVerify)
        {
            return res.status(406).json({ response: 'Password not a match' })
        }


        const adminToken = jwt.sign({ admin: name }, process.env.JWT_SECRET_ADMIN)

        res.cookie('adminToken', adminToken, {
            httpOnly: true
        }).send()

    } catch (error)
    {
        console.log(error);
    }
})

// ============================== ADMIN SIGNIN END +====-=========================


// =================USER MANAGMENT START============================================

//------------------------FETCH USERS START----------------------------------------

router.get('/get-user', async (req, res) => {

    try
    {

        const users = await userModel.find({})
        res.json(users)
    } catch (error)
    {
        console.log(error);
    }


})
//---------------------------FETCH USERS END---------------------------------------

// --------------------------BLOCK USER START--------------------------------------

router.get('/user-block/:id', async (req, res) => {

    try
    {
        const _id = req.params.id

        const isUser = await userModel.findOne({ _id })

        if (!isUser)
        {
            return res.status(406).json({ response: 'Admin not Found' })
        }

        if (isUser.isActive)
        {
            await userModel.updateOne({ _id }, { $set: { isActive: false } })

            res.json({
                status: true,
                userStatus: 'block(ed)'
            })
        } else
        {
            await userModel.updateOne({ _id }, { $set: { isActive: true } })
            res.json({
                status: true,
                userStatus: '(un)block(ed)'
            })



        }



    } catch (error)
    {
        console.log(error);
    }

})


//---------------------------BLOCK USER END---------------------------------------

// ==================USER MANAGMENT START===========================================

// ==================CATEGORY MANAGEMNT START==============================================
// ----------------------VIEW CATEGORY START---------------------------------
router.get('/category', async (req, res) => {
    try {
         const category =await catModel.find({})
res.json(category)

    } catch (error) {
        console.error(error);
    }

//-------------------------VIEW CATEGORY END---------------------------------
//-------------------Add categorystart-------------------------------------

router.post('/category/add', async (req, res) => {


    try
    {
        const { category } = req.body

        if (!category)
        {
            return res.status(406).json({ response: "Please fill all" })
        }

        const existcat = await catModel.findOne({ category })
        console.log(
           existcat 
        );
        if (existcat)
        {
            return res.status(406).json({ response: "Category already exist " })
        } else
        {
            const newCategory = new catModel({
                category
            })
            await newCategory.save();
            res.json(true)
    
        }
       


    } catch (error)
    {
        console.log(error);

    }
})

// -------------------ADD CATEGORY END--------------------------------------

// ---------------------DELETE CATEGORY- START--------------------------------------\
router.get('/category/delete/:id', async (req, res) => {
    try
    {
        const _id = req.params.id
       

        const existcat = await catModel.findOne({ _id})
        console.log(
           existcat 
        );
        if (!existcat)
        {
            return res.status(406).json({ response: "Category not found" })
        } else
        {


            catModel.deleteOne({ _id }).then(response => {
            
                res.json(true)
            }).catch(err => {
                console.error(err);
            })
        }
} catch (error) {
    console.error(error);
}


})

// ----------------------DELETE CATEGORY END-----------------------------------------

// ---------------------- EDIT CATEGORY START---------------------------------------
router.post('/category/edit', async (req, res) => {
    
    try
    {
    
        const { _id,category}=req.body
        const existcat = await catModel.findOne({_id})
        if (!existcat)
        {
            return  res.status(406).json({response:'Category not found'})
        }
        const existcat2 = await catModel.findOne({ category })
        if (existcat2)
        {
            return  res.status(406).json({response:'Category exist'})
        }

        catModel.updateOne({ _id }, { $set: { category } }).then(response => {
         
            res.json(true)
        })

} catch (error) {
    console.error(error);
}

  


})

}) 
// -----------------------EDIT CATEGORY END-----------------------------------------


// ===================SUB-CATEGORY MANAGMENT START=============================================
// --------------------view sub category start------------------------------
router.get('/category/sub/:id', async (req, res) => {
    
    try
    {
    
        const _id = req.params.id
        
        const existcat = await catModel.findOne({_id})
        if (!existcat)
        {
   return res.status(406).json({response:'Category not found'})
        }
        res.json(existcat.subCat)
} catch (error) {
    console.error(error);
}
})

// ---------------------view subcategory end------------------------------------------
// --------------------------add subcategory start------------------------------------


router.post('/category/sub/add/', async(req, res) => {
    
try {
    
    const { subArray,_id } = req.body

    if (!subArray)
    {
      return  res.status(406).json({ response: 'fill all' })
        
    }
    const existCat = await catModel.find({_id})
    if (!existCat)
    {
        console.log('error');
     return    res.status(406).json({ response: 'Category not found' })
    }
    // db.categories.update({_id)},{$addToSet:{subCat:{$each:['hello','seen','achaa']}}})
 
  const response= await catModel.updateOne({ _id }, { $addToSet: { subCat: { $each: subArray } } })
  
    res.json(response.acknowledged)
}
 catch (error)
    {
    console.error(error);
}
 
})
// --------------------------add subcategory end--------------------------------------


//---------------------------edit subcategory start----------------------------------
router.post('/category/sub/edit/', async (req, res) => {
     
    try {
        
const { _id, subCat,newSubCat } = req.body

        if (!_id || !subCat||!newSubCat)
        {
          return  res.status(406).json({ response: 'Category not found' })
        }
        const existCat = await catModel.find({_id})
        if (!existCat)
        {
            console.log('error');
          return   res.status(406).json({ response: 'Category not found' })
        }

  const response= await catModel.updateOne({ _id,subCat}, { $set: { "subCat.$":newSubCat   } })
res.json(response.acknowledged)
    } catch (error) {
        console.log(error);
    }
    


 })


//---------------------------edit subcategory end------------------------------------





// --------------------------delete subcategory start--------------------------------------


router.post('/category/sub/delete', async (req, res) => {
    
    try
    {
        
        const { _id, subCat } = req.body
        
        if (!_id || !subCat)
        {
          return  res.status(406).json({ response: 'Fill all' })
        }
        // db.categories.update({_id:ObjectId("6190fae0cbf384989504aaad")},{$pull:{subCat:null}})

        const response = await catModel.updateOne({ _id }, { $pull: { subCat } })
        console.log(response);
        
    } catch (error) {
        console.log(error);
    }
})




// -------------------------delete subcategory end-----------------------------------------
// ====================SUB-CATEGORY MANAGMENT END==============================================




// ===================CATEGORY MANAGMENT END=============================================
module.exports = router