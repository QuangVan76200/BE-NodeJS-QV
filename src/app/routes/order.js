const express = require('express');
const router = express.Router();
const verifyToken = require('../middlware/auth')
const Accounts = require('../models/Accounts');
const Product = require('../models/Products');
const Cart = require('../models/Cart');
const checkTokenadmin=require('../middlware/authAdmin')
const mongoose = require('mongoose');
const Order = require('../models/Order');



router.post('/orderProduct', verifyToken, async(req, res, next)=>{
    const{
        IDUser,
        IDproduct,
        adress,
        status
    }=req.body;

    try {
        var order= await Order.findOne({IDUser:req.UserID});
        var findProduct=null;
        try {
            findProduct =await Product.findById(IDproduct);
        } catch (error) {
            return res.json({
                success:false,
                message:'Product does not exists'
            })
        }
        if(order){
            if(findProduct){
            
            const newOrder = new Order({
                
                IDUser:req.UserID,
                IDproduct:findProduct?.IDproduct,
                adress,
                status, 
            })

            await newOrder.save();

            return res.json({
                message:'Invoice creation successful',
                success:true,
                newOrder
            })
        }
        else{
            return res.json({
                success: false,
                message: 'Error Serverorder initialization failed'
            })
        }
    }
    else{
        return res.json({
            success:false,
            message:'Invalid User',
        })
    }
    } catch (error) {
        return res.json({
            success: false,
            message: 'Error Server'
        })
    }

    
})

module.exports = router