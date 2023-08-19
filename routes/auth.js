const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req,res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(
            req.body.password, 
            process.env.PASS_key
        ).toString(),
    });

    try{
        const savedUser = await newUser.save()
        res.status(201).json(savedUser);
    }catch(err){
        res.status(500).json(err);
    } 
});

//LOGIN

router.post("/login", async (req,res)=>{
    try{
        
        const user = await User.findOne({ username: req.body.username });
        console.log(user);
        !user && res.status(401).json("Wrong 1 credentials!");

        const hashedPassword = CryptoJs.AES.decrypt(
            user.password,
            process.env.PASS_key,
        );

        const OrignalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
        
        OrignalPassword !== req.body.password &&
        res.status(401).json("Wrong 2 credentials!");

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        },process.env.JWT_PASS,
        {expiresIn:"1d"}
        )
        const { password, ...other }= user._doc;

        res.status(200).json({...other,accessToken});
        console.log("LogIn is working");
    }catch(err){
        res.status(500).json(err);
        console.log("LogIn system error");
    }
})

module.exports = router