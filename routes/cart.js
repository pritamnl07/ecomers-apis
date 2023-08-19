const router = require("express").Router();
const Cart = require("../models/Cart");
const {varifyTokenAndAuthorization,varifyTokenAndAdmin,verifyToken} = require("./verifyToken");

//CREATE
router.post("/",verifyToken, async (req,res)=>{
    const newCart = new Cart(req.body)

    try{
        const savecart = await newCart.save();
        res.status(200).json({ success: true, "message": "Cart addeated successfully", data: { user: savecart } });
    } catch(err){
        res.status(500).json(err);
    }
})


//UPDATE CART
router.put("/:id", varifyTokenAndAuthorization, async (req,res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({ success: true, "message": "Cart updated successfully", data: { user: updatedCart } });
    } catch(err){
        res.status(500).json(err);
        console.log("update error 500.",varifyTokenAndAdmin);
    }
});

// //DELETE CART

router.delete("/:id", varifyTokenAndAuthorization, async (req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has been deleted")
    }catch(err){
        res.status(500).json(err)
    }
})

//GET CART
router.get("/find/:userId",varifyTokenAndAuthorization, async (req,res)=>{
    try{
        const cart = await Cart.findOne({ userId: req.params.userId});
        res.status(200).json(cart);
    }catch(err){
        res.status(500).json(err)
    }
})

//GET ALL CARTs
router.get("/",varifyTokenAndAdmin, async (req,res)=>{
    try{
        const carts = await Cart.find();
        res.status(200).json(carts);
    }catch(err){
        res.status(500).json(err)
    }
})

// //GET PRODUCT BY SOMTHING

// router.get("/find", async (req,res)=>{
//     const qNew = req.query.new;
//     const qCategory = req.query.category;
//     try{
//         let carts;

//         if(qNew){
//             carts = await Cart.find().sort({createdAt: -1}).limit(5)
//         } else if(qCategory){
//             carts = await Cart.find({
//                 categories: {
//                     $in: [qCategory],
//                 }
//             })
//         }else{
//             carts = await Cart.find();
//         }

//         res.status(200).json(carts);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// })


module.exports = router