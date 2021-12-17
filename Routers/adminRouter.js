const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const adminModel = require('../models/adminModel')
const userModel = require('../models/userModel')
const catModel = require('../models/categoryModel')
const {cloudinary} =require('./utils/cloudinary')
const uploads=require("./utils/multer")
const { route } = require('./userRouter')
const { editProductCat } = require('../helpers/ProductHelpers')
const { getCountData, getSalesRangeReport, getReportData } = require('../helpers/orderHelpers')







router.get('/', (req, res) => {
    res.send('hello admin')
})
// verify admin astart
router.get('/loggedIn',async  (req, res) => {
  
    try
    {

     const response = {}
      const token = req.cookies.adminToken	
     if (!token)
     {
      
       return res.json(false)
     }
    const user = jwt.verify(token, process.env.JWT_SECRET_ADMIN)
    if (user)
     {
     return  res.json(true)
     }
      else{

       res.send(false)
      }
      //  req.user = verified.user
    //  console.log(user);
  
   
  } catch (error)
  {
    console.log(error);
    res.json(false)
  }
  })


// verify admin end

// ================= ADMIN SIGNUP START +===============================
// admin logout start



router.get('/logout', (req, res) => {

    res.cookie("adminToken", "", {
  
        httpOnly: true,
        expires:new Date(0)
    }).send()
  })
// admin logout end





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
        if (!name || !password)
        {
            return res.json({ response: 'Please fill All' })
        }

        const existAdmin = await adminModel.findOne({ name })
        if (!existAdmin)
        {
            return res.json({ response: 'Admin not Found' })
        }

        const { passwordHash } = existAdmin
        const passwordVerify = await bcrypt.compare(password, passwordHash)
        if (!passwordVerify)
        {
            return res.json({ response: 'Incorrect Password' })
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


const pageSize=7
const page = Number(req.query.pageNumber)||1

const keyword = req.query.keyword ?
{
    name:{
        $regex:req.query.keyword,
        $options:'i'
        
    }
}:{}


const count =await userModel.count({...keyword })
        const users = await userModel.find({...keyword}).limit(pageSize).skip(pageSize*(page-1))

        res.json({users,page,pages:Math.ceil(count/pageSize)})
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
        const { categoryName } = req.body
        const category=categoryName
console.log(categoryName);
        if (!categoryName)
        {
            return res.json({ response: "Please fill all" })
        }

        const existcat = await catModel.findOne({ category:categoryName })
        console.log(existcat );
        if (existcat)
        {
            return res.json({ response: "Category already exist " })
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
    console.log(req.body);
        const { oldCategory,newCategory}=req.body
        const existcat = await catModel.findOne({category:oldCategory})
        if (!existcat)
        {
            return  res.json({response:'Category not found'})
        }
        const existcat2 = await catModel.findOne({ category:newCategory })
        if (existcat2)
        {
            return  res.json({response:'Category exist'})
        }

        catModel.updateOne({ category:oldCategory }, { $set: { category:newCategory } }).then(response => {
         
editProductCat(oldCategory,newCategory).then((response)=>{

    res.json(response)
    
})

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
    console.log('here subcat');
    const { subCat,_id } = req.body

    if (!subCat)
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
 
  const response= await catModel.updateOne({ _id }, { $addToSet: { subCat } })
  
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
        
const {_id,subCat,newsubCat} = req.body

        if (!_id || !subCat||!newsubCat)
        {
          return  res.json({ response: 'fill all' })
        }
        const existCat = await catModel.find({_id})
        if (!existCat)
        {
           
          return  res.json({ response: 'Category not found' })
        }

  const response= await catModel.updateOne({ _id,subCat}, { $set: { "subCat.$":newsubCat   } })
res.json(true)
    } catch (error) {
        console.log(error);
    }
    


 })


//---------------------------edit subcategory end------------------------------------





// --------------------------delete subcategory start--------------------------------------


router.post('/category/sub/delete', async (req, res) => {
    
    try
    {
        res.send('hiii')
        
        const { _id, subCat } = req.body
        
        if (!_id || !subCat)
        {
          return  res.status(406).json({ response: 'Fill all' })
        }
        // db.categories.update({_id:ObjectId("6190fae0cbf384989504aaad")},{$pull:{subCat:null}})

        const response = await catModel.updateOne({ _id }, { $pull: { subCat } })
        
    } catch (error) {
        console.log(error);
    }
})




// -------------------------delete subcategory end-------------------------------------->
// ====================SUB-CATEGORY MANAGMENT END========================================
// ===================CATEGORY MANAGMENT END=============================================



// Dahboard count data start

router.get('/dashboard-details',(req,res)=>{

try {
    getCountData().then(response=>{


        res.json(response)
    })


} catch (error) {

    console.error('This is the dshbiard count  '+error);
    
}

})
// dashboard data end

router.post('/sales-report/range',(req,res)=>{


try {


    const{fromDate,toDate}=req.body

    if(!fromDate||!toDate){
        return res.json({response:'fill all'})
    }
     

   getSalesRangeReport(fromDate,toDate).then(response=>{

    res.json(response)
   }) 
    
} catch (error) {
    console.error('this is the sales report range error    '+error);
}




})


// get data as yearly monthly date

router.get('/sales-report/type/:type',(req,res)=>{


    try {
    const type = req.params.type    
      
         
    getReportData(type).then(response=>{
    
        res.json(response)
       }) 
        
    } catch (error) {
        console.error('this is the sales report range error    '+error);
    }
    
    
    
    
    })



 router.get('/dashboard/chart',async (req,res)=>{
     try {
    let userData=[]
    let weeklyData=[]
 const totalCount = await userModel.find({}).count()
 const totalBlocked = await userModel.find({isActive:false}).count()

userData[0]=totalBlocked
userData[1]=totalCount-totalBlocked
console.log(userData);
getReportData('Weekly').then(response=>{

    response.map((value)=>{
        weeklyData.push(value.orders.amount)
       
           })

           
           const data ={
            user:userData,
    sales:weeklyData
    }
    
    res.json(data)
   }) 

 

} catch (error) {
    console.log('This is the error  ' +error)  
}



 })   

module.exports = router