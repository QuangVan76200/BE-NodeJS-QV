const { verify } = require('argon2');
const express = require('express');
const router = express.Router();


const verifyToken= require('../middlware/auth')
const Comment= require('../models/Comments');
const Post = require('../models/Post');
const Accounts  = require('../models/Accounts');



router.post('/:id',verifyToken,async(req, res, next)=>{
//    const idPost= req.params._id;

//    const comment = new Comment({
//        text:req.body.comment,
//        Post:idPost

//    })

//    await comment.save();
//    const posts= await Post.find({IDUser: req.UserID})
//    posts.comments.push(comment)
//    await posts.save();

           const  {text}=req.body;
           
           try {
            const idPost= await Post.findById({_id:req.params.id})
            if(!idPost){
                return res.json({
                    success:false,
                    message:'The post not exist'
                })
            }
               const comment= new Comment({
                   text,
                   Post:req.params.id,
                   IDUser: req.UserID
               })
               await comment.save()

               return res.json({
                   success:true,
                   message:'successfully',
                   comment,
               })

           } catch (error) {
            return res.json({
                success:false,
                message:'Internal server error'
            })
           }

})






module.exports=router