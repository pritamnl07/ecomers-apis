const router = require("express").Router();
const randomstring = require('randomstring');
const User = require("../models/User");

//console.log("update 1");
router.post("/otp", async (req, res) => { //console.log("OTP Createing...");
    // const generateOtp = () => {
    //     var otps = " ";
    //     for (let i = 0; i < 6; i++) {
    //         otps = otps + Math.floor(Math.random() * 10);
    //     }
    //     return Number(otps);
    // }
    const OTP = await randomstring.generate({ length: 6, charset: 'numeric' })
    console.log("OTP", OTP)
    try {
        // const userInfo = await User.findOne({ username: req.body.username });

        // if(userInfo){var ooo = generateOtp();
        // }else{res.status(401).json("you are entered a wrong username")};

        let userData = await User.findOneAndUpdate(
            { username: req.body.username },
            { $set: { otp: OTP } }
        );
        if (userData) {
            return res.status(200).json({ success: true, "message": "OTP generated successfully !", data: { otp : OTP } });
        } else {
            return res.status(200).json({ success: false, "message": "User not found" });
        }
    } catch (err) {
        res.status(500).json(err);
        console.log("update error", err);
    }
});



module.exports = router