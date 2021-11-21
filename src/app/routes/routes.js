const express = require('express');
const router = express.Router();
const Accounts = require('../models/Accounts');
const Argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlware/auth');
// const AdminBro = require('admin-bro');
// const AdminBroExpressjs = require('admin-bro-expressjs');
// const { application } = require('express');
// const Role = require('_helpers/role');



//XAC THUC DANG KY



router.post('/', async (req, res) => {
  try {
    const {
        userName,
        passWord,
        active,
        role,
    } = req.body;
    if (!userName || !passWord || !active ||!role) {
        return res.json('Username or Password is not missing');
    }
    const User = await Accounts.findOne({
        userName
    });
    if (User) {
        return res.json('Da Ton Tai');

    }
    const passwordhash = await Argon2.hash(passWord);
    const newUser = new Accounts({
        userName,
        passWord: passwordhash,
        active,
        role,
    });
    
    await newUser.save();
    

    const token = await jwt.sign({
        idUser: newUser._id
    }, 'afakdaskjbddaskdbs');
    return res.json({
        newUser,
        tokenprocess: token
        
        
    })
  } catch (error) {
      console.log(error)
      return res.json({success:false,
         message:'Internal Server Error'
    })
  }
})



//XAC THUC DANG NHAP





router.post('/login1', async (req, res, next) => {
    try {
        const {
            userName,
            passWord
        } = req.body;

        console.log(userName,passWord)
        
        if (!userName || !passWord) {
            return res.json({
                success: false,
                message: 'All input is required',
            })
        }
        const User = await Accounts.findOne({
            userName
        });
        if (User) {
           
            const passwordhash = await Argon2.verify(User.passWord, passWord); //Verify đk ss
           
            if (!passwordhash) {
                return res.json({
                    success: false,
                    message: 'Wrong password',
                })
            } else {
                // console.log('Hello')
                const token = await jwt.sign({UserID: User._id, role:User.role}, 'afakdaskjbddaskdbs') //.sign truyen 1 doi tuong
                     return res.json({
                        token:token,
                        message:'Successful Login',
                        success: true
                    })
            }
        } else {
            return res.json({
                message:'Account does not exist',
                success: false,
            })
        }
    } catch (error) {
        return res.json({
            success:false,
            message:'Fail Connect'

        })
    }

    


})
//FOLLOWER CA NHAN

router.post('/follows/:id',verifyToken,async(req, res, next)=>{
    if (req.params.id !== req.UserID){
    try {
        
        let accounts=await Accounts.findById(req.UserID)
        
        let currentUser= await Accounts.findById(req.params.id);
    

       if(!currentUser){
           return res.json({
               success:false,
               message:'User does not exist'
           })
       }
       else{    

           if(currentUser.follows.filter((follow)=>follow.user === req.UserID).length>0){
               const indexFollow=accounts.follows.map((values)=>values.user).indexOf(req.UserID)
               currentUser.follows.splice(indexFollow, 1)
           }
           else
               await currentUser.follows.unshift({user: req.UserID, name:accounts.userName})
           
           await currentUser.save();
           return res.json({
               success:true,
               message:'successflly',
               currentUser
           })
    }
    } catch (error) {
        return res.json({
            success: false,
            message: 'you already followed the user'
        })
    }
}
else{
    return res.json({
        success:false,
        message:'You can not follow yourself '
    })
}
})

module.exports=router

