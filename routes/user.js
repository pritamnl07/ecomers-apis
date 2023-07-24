const varifyTokenAndAuthorization = require("./verifyToken");

const router = require("express").Router();


//UPDATE
console.log("update stage 1");
router.get("/:id",varifyTokenAndAuthorization, async (req,res)=>{ 
    console.log("update stage 2");
    if(req.body.password){
        req.body.password= CryptoJs.AES.encrypt(
            req.body.password, 
            process.env.PASS_key
        ).toString();
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(
        req.params.id, 
        {
            $set: req.body,
        },
        { new: true }
        );
        res.status(200).json(updatedUser);
    } catch(err){
        res.status(500).json(err);
        console.log("update error");
    }
});

module.exports = router;