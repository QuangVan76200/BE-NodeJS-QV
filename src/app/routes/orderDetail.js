const express = require('express');
const router = express.Router();
const verifyToken = require('../middlware/auth')
const Accounts = require('../models/Accounts');
const Product = require('../models/Products');
const Cart = require('../models/Cart');
const checkTokenadmin=require('../middlware/authAdmin')
const mongoose = require('mongoose');
const Order = require('../models/Order');
const { find } = require('../models/Accounts');
const OrderDetail = require('../models/OrderDetail');


router.post('/orderDetail', verifyToken,(req, res, next)=>{
    const{
        OrderID,
        IDproduct,
        price,
        quantity,
        total
    }=req.body;

    try {
        const order= await OrderDetail.findById({OrderID});
        var findProduct = null;
        try {
            findProduct = await Product.findById({IDproduct});
        } catch (error) {
            res.json({
                success:false,
                message:'Product does not exists'
            })
        if(order){
            if(findProduct){
                var newTotal= order.price*order.quantity;
                const updateOrderDetail = await OrderDetail.findByIdAndUpdate(order._id,{
                    OrderID,
                    IDproduct,
                    total:newTotal
                })
                return res.json({
                    success:true,
                    message:'successfully',
                    updateOrderDetail
                })

            }
        }
        else{
            const newOrderDetail= new OrderDetail({
                 OrderID,
                 IDproduct,
                 quantity:findProduct?.price,
                 quantity,
                 total:quantity*findProduct.price
            })
            await newOrderDetail.save();

            return res.json({
                success:true,
                message:'order details have been successfully created',
                newOrderDetail,
            })
        }
           
        }
    } catch (error) {
        return res.json({
            success: false,
            message: 'Error Server'
        })
    }

})



module.exports = router