const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');



async function checkToken(req, res , next){
    const header=req.header('Authorization')
    const token=(!!header)?header.split(' ')[1]:header;
    if(!token){
        return res.json({
            message:'A token is required for authentication',
            success:false
        })
    }
    try {
        const decoded= await jwt.verify(token,'afakdaskjbddaskdbs');
        if(!!decoded)
        {
           req.UserID=decoded.UserID;
        //console.log(req.UserID),
           next();
        }
        else{
            return res.json({
                success:false,
                message:'Token not found'
            })
        }
    } catch (error) {
        return res.json({
            message:'Invalid Token',
            success:false
        })
    }
}



module.exports= checkToken

