const router = require("express").Router();
const {varifyTokenAndAuthorization,varifyTokenAndAdmin} = require("./verifyToken");
const Product = require("../models/Product");
//const CryptoJs = require("crypto-js");
const { query } = require("express");

//CREATE
router.post("/",varifyTokenAndAdmin, async (req,res)=>{
    const newProduct = new Product(req.body)

    try{
        const saveproduct = await newProduct.save();
        res.status(200).json({ success: true, "message": "Product addeated successfully", data: { user: saveproduct } });
    } catch(err){
        res.status(500).json(err);
    }
})


//UPDATE PRODUCT
router.put("/:id", varifyTokenAndAdmin, async (req,res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({ success: true, "message": "Product updated successfully", data: { user: updatedProduct } });
    } catch(err){
        res.status(500).json(err);
        console.log("update error 500.",varifyTokenAndAdmin);
    }
});

// //DELETE PRODUCT

router.delete("/:id", varifyTokenAndAdmin, async (req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product has been deleted")
    }catch(err){
        res.status(500).json(err)
    }
})

//GET PRODUCT
router.get("/find/:id", async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    }catch(err){
        res.status(500).json(err)
    }
})

//GET ALL PRODUCTs
router.get("/", async (req,res)=>{
    try{
        const products = await Product.find();
        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err)
    }
})

//GET PRODUCT BY SOMTHING

router.get("/find", async (req,res)=>{
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        let products;

        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5)
        } else if(qCategory){
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                }
            })
        }else{
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router