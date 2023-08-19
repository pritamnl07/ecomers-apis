const router = require("express").Router();
const Order = require("../models/Order");
const {varifyTokenAndAuthorization,varifyTokenAndAdmin,verifyToken} = require("./verifyToken");

//CREATE
router.post("/",verifyToken, async (req,res)=>{
    const newOrder = new Order(req.body)

    try{
        const saveorder = await newOrder.save();
        res.status(200).json({ success: true, "message": "Order addeated successfully", data: { user: saveorder } });
    } catch(err){
        res.status(500).json(err);
    }
})


//UPDATE ORDER
router.put("/:id", varifyTokenAndAdmin, async (req,res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({ success: true, "message": "Order updated successfully", data: { user: updatedOrder } });
    } catch(err){
        res.status(500).json(err);
        console.log("update error 500.",varifyTokenAndAdmin);
    }
});

// //DELETE ORDER

router.delete("/:id", varifyTokenAndAdmin, async (req,res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order has been deleted")
    }catch(err){
        res.status(500).json(err)
    }
})

//GET ORDER
router.get("/find/:userId",varifyTokenAndAuthorization, async (req,res)=>{
    try{
        const order = await Order.find({ userId: req.params.userId});
        res.status(200).json(order);
    }catch(err){
        res.status(500).json(err)
    }
})

//GET ALL ORDER
router.get("/",varifyTokenAndAdmin, async (req,res)=>{
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router