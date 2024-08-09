const express = require('express');
const router = express.Router();
const { Product } = require('../models/product');
const { Category } = require('../models/category');
const { name } = require('body-parser');
const pLimit = import('p-limit');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
});



router.get('/',async(req,res)=>{
    const productList = await Product.find().populate("category");

    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList);
});

router.get('/:id',async(req,res)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        res.status(500).json({message: 'The product with the given ID was not found.'})
    }
    return res.status(200).send(product);
});

router.post('/create',async(req,res)=>{

    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(404).send("Invalid Category!");
    }

    pLimit.then(plimit => {
        const limit = pLimit(2);
    }).catch(error => {
    console.error('Failed to import plimit:', error);
    });

    const imageToUpload = req.body.images.map((image)=>{
        return limit(async()=>{
            const result = await cloudinary.uploader.upload(image);
            console.log(`Successfully upload ${image}`);
            console.log(`> Results : ${result.secure_url}`);
     
            return result;
        })
     });
     const uploadStatus = await Promise.all(imageToUpload);
     const imgurl = uploadStatus.map((item)=>{
        return item.secure_url
     })
     
     
     if(!uploadStatus){
        return res.status(500).json({
            error:"image cannot upload",
            status:false
        })
     }
        
    
    let product = new Product({
        name:req.body.name,
        description:req.body.description,
        brand:req.body.brand,
        images:imgurl,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured,
    });
    product = await Product.save();
    if(!product){
        res.status(500).json({
            error:err,
            success:false
        })
    }
    res.status(201).json(product)
});

router.delete('/:id',async(req,res)=>{
    const deleteProduct = await Product.findByIdAndDelete(req.params.id);

    if(!deleteProduct){
        res.status(404).json({message: 'product not found!'})
        success: false
    }
    res.status(200).json({
        status:true,
        message:'Category Deleted'
    })
});

router.put('/:id',async(req,res)=>{

    pLimit.then(plimit => {
        const limit = pLimit(2);
    }).catch(error => {
    console.error('Failed to import plimit:', error);
    });

    const imageToUpload = req.body.images.map((image)=>{
        return limit(async()=>{
            const result = await cloudinary.uploader.upload(image);
            console.log(`Successfully upload ${image}`);
            console.log(`> Results : ${result.secure_url}`);
     
            return result;
        })
     });
     const uploadStatus = await Promise.all(imageToUpload);
     const imgurl = uploadStatus.map((item)=>{
        return item.secure_url
     })
     
     
     if(!uploadStatus){
        return res.status(500).json({
            error:"image cannot upload",
            status:false
        })
     }
        

    const product = await Product.findByIdAndUpdate(
        req.params.id,
            {
                name:req.body.name,
                description:req.body.description,
                brand:req.body.brand,
                images:imgurl,
                price:req.body.price,
                category:req.body.category,
                countInStock:req.body.countInStock,
                rating:req.body.rating,
                numReviews:req.body.numReviews,
                isFeatured:req.body.isFeatured,
            },
            {new:true});
        
        if(!product){
        res.status(404).json({
            message: 'product cannot be updated!',
            success:false
        })
        }
        res.status(200).json({
            message:'the product is update.',
            status:true
        });

        //res.send(product);


});

module.exports = router;