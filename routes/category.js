
const pLimit = import('p-limit');
const { Category } = require('../models/category');
const express = require('express');
const router = express.Router();


const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
});

router.post('/create',async(req,res)=>{

    
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

let category = new Category({
   name:req.body.name,
   images:imgurl,
   color:req.body.color
})

if(!category){
   res.status(500).json({
       error:err,
       success:false
   })
}

category = await category.save();

res.status(201).json(category);
});

router.get('/',async(req,res)=>{
    const categoryList = await Category.find();

    if(!categoryList){
        res.status(500).json({success:false})
    }
    res.send(categoryList);
});

router.get('/:id',async(req,res)=>{
    const categoryList = await Category.findById(req.params.id);

    if(!categoryList){
        res.status(500).json({message: 'The category with the given ID was not found.'})
    }
    return res.status(200).send(categoryList);
});

router.delete('/:id',async(req,res)=>{
    const deleteUser = await Category.findByIdAndDelete(req.params.id);

    if(!deleteUser){
        res.status(404).json({message: 'category not found!'})
        success: false
    }
    res.status(200).json({
        success:true,
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
            return res.status(404).json({
                error:"image cannot upload",
                status:false
            })
        }

    const category = await Category.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        images:imgurl,
        color:req.body.color
    },{new:true});

    if(!category){
        res.status(404).json({
            message: 'category cannot be updated!',
            success:false
        })
    }
    res.send(category);
});


   

module.exports = router;