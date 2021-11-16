const router = require("express").Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// root start
router.get("/", (req, res) => {
  res.send("hello user");
});
// root end

//------------------------ user signup start--------------------------------

router.post("/signup", async (req, res) => {
  try
  {
    console.log('undd');
    const { name, password, phone, email } = req.body;
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

    // password hash

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    let isActive = true; //block status

    const newUser = new userModel({
      name,
      email,
      passwordHash,
      phone,
      isActive,
    });

    const savedUser = await newUser.save();
        // JWT token creation start
        const userToken = jwt.sign({ user:savedUser._id }, process.env.JWT_SECRET_USER);
        

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
    if (!existUser)
    {
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
    console.log('OKKO FOISEDNFUISDFBIUSDBFUI');
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
router.get('/loggedIn',async  (req, res) => {
  
  try
  {
    console.log('reached');
   const response = {}
    const token = req.cookies.userToken
    console.log('saasd'+token);
   if (!token)
   {
    
     return res.json(false)
   }
  const {user} = jwt.verify(token, process.env.JWT_SECRET_USER)
   if (!user)
   {
   return  res.json(false)
   }
    
    const userDetails = await userModel.findOne({ _id: user })
    const {isActive} =userDetails
    if (!isActive)
    {
  return res.json(false)
    }
    
res.json({
userDetails,status:true

})
    //  req.user = verified.user
  //  console.log(user);

 
} catch (error)
{
  console.log(error);
  res.json(false)
}
})
// ==============================VERIFY USER END==============================================
// ================USER LOGOUT START==================
router.get('/logout', (req, res) => {
  res.cookie("userToken", "", {

      httpOnly: true,
      expires:new Date(0)
  }).send()
})
// ===============USER LOGOUT END====================
module.exports = router;
