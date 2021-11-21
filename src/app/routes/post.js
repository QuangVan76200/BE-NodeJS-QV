const express = require('express');
const router = express.Router();
const verifyToken = require('../middlware/auth')
const Accounts = require('../models/Accounts');
const Post = require('../models/Post')
const multer = require('multer');


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





//GET POST
router.get('/show_post', verifyToken, async (req, res, next) => {
    try {
        const posts = await Post.find({
            IDUser: req.UserID
        })
        res.json({
            success: true,
            posts
        })
    } catch (error) {
        return res.json({
            success: false,
            message: 'Internal server error'
        })
    }
})
//CREATE POST
router.post('/news_post', upload.single('postImage'), verifyToken, async (req, res) => {
    const {
        title,
        descpription,
        postImage,
        status
    } = req.body;


    // router.get('/auth',verifyToken)

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
        const newPost = new Post({
            title,
            descpription,
            postImage: req.file ?.path,
            status: 'Normal Post' || 'Sales Post',
            IDUser: req.UserID


        })
        await newPost.save()

        return res.json({
            success: true,
            message: 'successful',
            post: newPost
        })
    } catch (error) {
        return res.json({
            success: false,
            message: 'Internal server error'
        })
    }
})


//UPDATE POST
router.put('/:id', verifyToken, async (req, res, next) => {
    const {
        title,
        descpription,
        status,
        postImage
    } = req.body;

    if (!title) {
        return res.json({
            success: false,
            message: 'Title is required',
        })
    }
    try {

        const postData = {
            title,
            descpription: descpription || ' ',
            status: status || 'Normal Post',
            postImage: postImage || ' ',
            IDUser: req.UserID
        }
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, postData, {
            new: true
        });
        if (!updatedPost) {
            return res.json({
                success: false,
                message: 'post not found or user not authorised'
            })
        }
        return res.json({
            success: true,
            message: 'Completed',
            post: updatedPost,
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

        const postDelete = {
            _id: req.params.id,
            IDUser: req.UserID
        };
        // console.log('Hello')
        const deletePost = await Post.findByIdAndDelete(req.params.id, IDUser, {
            new: true
        });
        console.log(deletePost);
        // console.log('Hello123');

        if (!deletePost) {
            return res.json({
                success: false,
                message: 'post not found authorised'
            })
        } else {
            return res.json({
                success: true,
                message: 'Completed',
                post: deletePost,
            })
        }
    } catch (error) {
        return res.json({
            success: false,
            message: 'Internal server error'
        })
    }
})


// LIKES A POST

router.post('/like/:id', verifyToken, async (req, res, next) => {

    try {
        
        const post = await Post.findById(req.params.id);
        const accounts=await Accounts.findById(req.UserID)
        if (!post) {
            return res.json({
                success: false,
                message: 'post does not exist',
            })
        } else {
            if (post.likes.filter(like => like.user === req.UserID).length > 0) {
                const index = post.likes.map((values)=>values.user).indexOf(req.UserID)
                post.likes.splice(index, 1)
            
            } else {
                await post.likes.unshift({user:req.UserID, name:accounts.userName})
            }
            await post.save();
            return res.json({
                success: true,
                message: 'success',
                post
            })
        }
    } catch (error) {
        return res.json({
            success: false,
            message: 'Internal server error'
        })
    }
})





module.exports = router