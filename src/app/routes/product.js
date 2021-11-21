const express = require('express');
const router = express.Router();
const verifyToken = require('../middlware/auth')
const Accounts = require('../models/Accounts');
const multer = require('multer');
const Product=require('../models/Products');
const checkTokenadmin=require('../middlware/auth');
const Products = require('../models/Products');
const checkTokenSales=require('../middlware/authSales')
const { findById } = require('../models/Accounts');





const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        // cb(null, new Date().toISOString() + file.originalname);
        cb(null, Date.now() + file.originalname); //prevent "error": "ENOENT: no such file or directory
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }


};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


//GET Products
router.get('/show_product', async (req, res, next) => {
    
    try {
        const products = await Product.find({
            IDUser: req.UserID
        })
        res.json({
            success: true,
            products
        })
    } catch (error) {
        return res.json({
            success: false,
            message: 'Internal server error'
        })
    }
})


//Create Product
router.post('/',upload.single('productImage'), checkTokenadmin,async(req, res, next)=>{
    
   const {
       title,
       desc,
       productImage,
       price,
       currency,
       quantity,
       IDproduct
   }=req.body;



   if (!title) {
    return res.json({
        success: false,
        message: 'Title is required',
    })
}
    try {
        const account = Accounts.findById({
            _id: req.UserID
        }).select('_id');

        if (!account)
            return res.json({
                message: 'id User invalid',
                success: false
            })
        const product= await Product.findOne({IDproduct})
            if(product){
                    return res.json({
                        success: false,
                        message:'Product is already exist'
                    })
            }
            else{
        
       
        const newProduct = new Product({
            title,
            desc,
            productImage:req.file ?.path,
            price,
            currency,
            quantity,
        })
        await newProduct.save();
        return res.json({
            success: true,
            message: 'successful',
            newProduct
        })

    }
        
    } catch (error) {
        return res.json({
            success: false,
            message: 'Internal server error'
        })
    }
})

//Update a Product Information
router.put('/:id', checkTokenadmin, async (req, res, next) => {
    const {
        title,
        desc,
        productImage,
        price,
        currency,
        quantity,
        IDproduct
    }=req.body;

    if (!title) {
        console.log(desc);
     return res.json({
         success: false,
         message: 'Title is required',
     })
 }
    try {
        const producttData = {
            title,
            desc: desc || ' ',
            productImage: productImage || ' ',
            price,
            quantity,
            currency,
            // IDproduct: req.params.id
        }
        const productUpdateCondition ={_id: req.params.id, UserID:req.UserID}
  
        const updatedProduct = await Post.findByIdAndUpdate(productUpdateCondition, producttData, {
            new: true
        });
        if (!updatedProduct) {
            return res.json({
                success: false,
                message: 'product not found or user not authorised'
            })
        }
        return res.json({
            success: true,
            message: 'Completed',
            product: updatedProduct,
        })


    } catch (error) {
        return res.json({
            success: false,
            message: 'Internal server error'
        })
    }
})



router.delete('/:id', verifyToken, async (req, res, next) => {
    try {

        const productDelete = {
            _id: req.params.id,
            IDUser: req.UserID
        };
        // console.log('Hello')
        const deleteProduct = await Product.findByIdAndDelete(productDelete);
        console.log(productDelete);
        // console.log('Hello123');

        if (!deleteProduct) {
            return res.json({
                success: false,
                message: 'post not found authorised'
            })
        } else {
            return res.json({
                success: true,
                message: 'Completed',
                product: deleteProduct,
            })
        }
    } catch (error) {
        return res.json({
            success: false,
            message: 'Internal server error'
        })
    }
})


module.exports=router