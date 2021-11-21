const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');




async function checkTokenadmin (req, res, next){
    const header= req.header('Authorization');
    const token=(!!header)?header.split(' ')[1]:header;


   try {
    const decoded= await jwt.verify(token,'afakdaskjbddaskdbs');
    if(!!decoded)
    {
    
       if(decoded.role==="admin")  
         next();
         else{
            return res.json({
                success:false,
                message:'Access Denied',
            })
         }
    }
    else{
        return res.json({
            success:false,
            message:'Token not found'
        })
    }
      
       
   } catch (error) {
    res.json({
        message:"Error Server",
        success:false
    })
   }
}
module.exports=checkTokenadmin