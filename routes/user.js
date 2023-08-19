const {varifyTokenAndAuthorization,varifyTokenAndAdmin} = require("./verifyToken");
const router = require("express").Router();
const User = require("../models/User");
//const otp = require("./otp");
const CryptoJs = require("crypto-js");

//UPDATE
router.put("/:id", varifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({ success: true, "message": "User data updated successfully", data: { user: updatedUser } });
    } catch (err) {
        res.status(500).json(err);
        console.log("update error", err);
    }
});

/* This function used for updated your forgot password */
router.patch("/fotgot-password", async (req, res) => {
    let user = await User.findOne({ username: req.body.username, otp: req.body.otp });
    if (user) {
        /* confirm password,user.passw new password must be equil */
        /* changes password and otp blank */
        if (req.body.new_password !== req.body.confirm_password) {
            return res.status(203).json({ success: false, "message": "Please check your new password and confirm password" });
        } else {
            let password = CryptoJs.AES.encrypt(
                req.body.confirm_password,
                process.env.PASS_key
            ).toString()

            user.password = password
            user.otp = ""
            await user.save()

            return res.status(201).json({ success: true, message: "Password updated successfully" });
        }
    } else {
        return res.status(203).json({ success: false, "message": "Please check your OTP and username" });
    }
})

//DELETE

router.delete("/:id", varifyTokenAndAuthorization, async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")
    }catch(err){
        res.status(500).json(err)
    }
})

//GET USER
router.get("/find/:id", varifyTokenAndAdmin, async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        const { password, ...other }= user._doc;
        res.status(200).json(other);
    }catch(err){
        res.status(500).json(err)
    }
})

//GET ALL USER
router.get("/", varifyTokenAndAdmin, async (req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = router;