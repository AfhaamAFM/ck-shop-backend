const router = require("express").Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userHelpers = require('../helpers/userHelpers');
const { addAddress, deleteAddress, editUser, changePassword, editAddress } = require("../helpers/userHelpers");
const { cloudinary } = require('./utils/cloudinary')
let referralCodeGenerator = require('referral-code-generator')






// root start
router.get("/", (req, res) => {
  res.send("hello user");
});
// root end

//------------------------ user signup start--------------------------------

router.post("/signup", async (req, res) => {
  try {
    // console.log('undd');
    const { name, password, phone, email, refCode: refcode } = req.body;
    console.log(refcode)
    if (!name || !email || !password || !phone) {
      return res.status(406).json({ response: "Please fill All" });
    }
    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
      res.json({ response: "Email already exist" });
    }
    const existPhone = await userModel.findOne({ phone });
    if (existPhone) {
      return res.json({ response: "Mobile number already exist" });
    }

    const isRefCode = await userModel.findOne({ refCode:refcode })
const {_id} = isRefCode
    if (!isRefCode) {
      return res.json({ response: "Inavlid Reference Code" });

    }
    const ok =   await userModel.updateOne({refCode:refcode},{$inc:{wallet:10}})
  //  await userModel.updateOne({ refCode:refcode }, { $inc: { wallet: 10 } })
console.log(_id,isRefCode)
    // password hash

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    let isActive = true; //block status
    let wallet = 0
    if (refcode) {
      wallet = 10
    }


    const refCode = referralCodeGenerator.alpha('lowercase', 8)
    const newUser = new userModel({
      name,
      email,
      passwordHash,
      phone,
      isActive,
      refCode,
      wallet
    });



    const savedUser = await newUser.save();
    // JWT token creation start
    const userToken = jwt.sign({ user: savedUser._id }, process.env.JWT_SECRET_USER);


    res
      .cookie("userToken", userToken, {
        httpOnly: true,
      })
      .send();

  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

// ---------------------------user signup end-------------------------------

// ----------------------------USER SIGN-IN START---------------------------------------
router.post("/signin", async (req, res) => {
  try {
    const { phone, email, password } = req.body;
    if ((!email && !phone) || !password) {
      return res.status(406).json({ response: "Please fill All" });
    }
    let existUser = 0;
    if (email) {
      existUser = await userModel.findOne({ email });
    } else {
      existUser = await userModel.findOne({ phone });
    }
    if (!existUser) {
      return res.json({ response: "User not found" });
    }
    const { isActive, passwordHash, _id } = existUser;

    if (!isActive) {
      return res.json({ response: "User Blocked" });
    }
    const passwordVerify = await bcrypt.compare(password, passwordHash);
    if (!passwordVerify) {
      return res.json({ response: "Incorrect Password" });
    }

    // JWT token creation start
    const userToken = jwt.sign({ user: _id }, process.env.JWT_SECRET_USER);

    //sending token as jwt
    // console.log('OKKO FOISEDNFUISDFBIUSDBFUI');
    res
      .cookie("userToken", userToken, {
        httpOnly: true,
      })
      .send();
    // jwt token creation end
  } catch (error) {
    console.error(error);
  }
});

// =============================USER SIGN-IN END========================================
// =============================VERIFY USER START=============================================
router.get('/loggedIn', async (req, res) => {

  try {

    const response = {}
    const token = req.cookies.userToken
    // console.log('saasd'+token);
    if (!token) {

      return res.json(false)
    }
    const { user } = jwt.verify(token, process.env.JWT_SECRET_USER)
    if (!user) {
      return res.json(false)
    }

    const userDetails = await userModel.findOne({ _id: user })
    const { isActive } = userDetails
    if (!isActive) {
      return res.json(false)
    }

    res.json({
      userDetails, status: true

    })
    //  req.user = verified.user
    //  console.log(user);


  } catch (error) {
    console.log(error);
    res.json(false)
  }
})
// ==============================VERIFY USER END==============================================
// ================USER LOGOUT START==================
router.get('/logout', (req, res) => {
  res.cookie("userToken", "", {

    httpOnly: true,
    expires: new Date(0)
  }).send()
})
// ===============USER LOGOUT END====================



// ==========================user adress add==========start=================


router.post('/address/add', (req, res) => {

  const token = req.cookies.userToken
  const address = req.body
  if (!token) {

    return res.json({ 'response': 'User not logged in' })
  }
  const { user: _id } = jwt.verify(token, process.env.JWT_SECRET_USER)
  if (!_id) {
    return res.json({ 'response': 'User not verified' })
  }



  const { name, pincode, street, landmark, district, state, number, flatNo } = address


  if (!name || !pincode || !street || !landmark || !district || !state || !number || !flatNo) {

    return res.json({ 'response': 'Fill all' })
  }

  addAddress(_id, address).then((response) => {

    res.json(response)

  }).catch((err) => {


    console.log('this is address add erre  ' + err);
  })


})


// =========================user addresss add ===========end=================

// ==========================user adress EDIT==========start=================


router.post('/address/edit', (req, res) => {

  const token = req.cookies.userToken
  const address = req.body
  if (!token) {

    return res.json({ 'response': 'User not logged in' })
  }
  const { user: _id } = jwt.verify(token, process.env.JWT_SECRET_USER)
  if (!_id) {
    return res.json({ 'response': 'User not verified' })
  }


  const { addressId } = address
  const { name, pincode, street, landmark, district, state, number, flatNo } = address


  if (!name || !pincode || !street || !landmark || !district || !state || !number || !flatNo) {

    return res.json({ 'response': 'Fill all' })
  }

  editAddress(_id, addressId, address).then((response) => {

    res.json(response)

  }).catch((err) => {


    console.log('this is address add erre  ' + err);
  })


})


// =========================user addresss EDIT ===========end=================

// ======================DELETE ADDRESS START================================


router.get('/address/delete/:addressId', (req, res) => {


  const token = req.cookies.userToken
  const addressId = req.params.addressId
  if (!token) {

    return res.json({ 'response': 'User not logged in' })
  }
  const { user: _id } = jwt.verify(token, process.env.JWT_SECRET_USER)
  if (!_id) {
    return res.json({ 'response': 'User not verified' })
  }


  deleteAddress(_id, addressId).then((response) => {


    res.json(response)
  })


})

// =======================DELETE ADDRESS END================================= 

// =================Edit user details===========================
router.post('/edit', (req, res) => {


  const token = req.cookies.userToken
  if (!token) {

    return res.json({ 'response': 'User not logged in' })
    console.log('JKBJKBHJD');
  }
  const { user: _id } = jwt.verify(token, process.env.JWT_SECRET_USER)
  if (!_id) {
    console.log('dsdsdsd');

    return res.json({ 'response': 'User not verified' })
  }


  const { name, email } = req.body


  editUser(_id, name, email).then(response => {

    res.json(response)
  }).catch(err => {

    console.log('This is user edit err +' + err);

  })


})
// =================Edit user details==========================




// ==================================================Change Password start=================================


router.post('/changePassword', async (req, res) => {

  const token = req.cookies.userToken
  if (!token) {

    return res.json({ 'response': 'User not logged in' })
    console.log('JKBJKBHJD');
  }
  const { user: _id } = jwt.verify(token, process.env.JWT_SECRET_USER)
  if (!_id) {
    console.log('dsdsdsd');

    return res.json({ 'response': 'User not verified' })
  }
  const { oldPassword, password } = req.body

  changePassword(_id, password, oldPassword).then(response => {


    res.json(response)
  })
})

// ==================================================Change Password start=================================

// ======================change profile image============================start====================

router.post('/imageUpload', async (req, res) => {

  try {

    const token = req.cookies.userToken
    if (!token) {

      return res.json({ response: 'user not logged in' })


    }
    const { user: _id } = jwt.verify(token, process.env.JWT_SECRET_USER)

    if (!_id) {

      return res.json({ response: 'user not verified' })
    }
    const { image: imageHere, oldImage } = req.body

    // console.log(req.body);

if(oldImage){
    await cloudinary.uploader.destroy(oldImage.public_id, function (error, result) {
      console.log(result, error)
    });

  }

    const uploadResponse = await cloudinary.uploader.upload(imageHere, {
      upload_preset: 'fnpbm7gw'
    })

    const { public_id, url } = uploadResponse

    const image = { public_id, url }
    userModel.updateOne({ _id }, { $set: { image } }).then(response => {

      res.json(true)
    })

  } catch (error) {

    console.error('This is uplosd error ' + error);
  }




})




// ==============================change profileimage end================================

// delete image 
router.get('/deleteImage', async (req, res) => {

  try {
    await cloudinary.uploader.destroy('bq36ctbntgwhrckgmtsq', function (error, result) {
      console.log(result, error)
    });
  } catch (error) {
    console.error('this is delte image error  ' + error);
  }


})


module.exports = router;
