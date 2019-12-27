const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/accounts')
const sharp = require('sharp')
const router = new express.Router()

//send throw error message with e.message



const upload = multer({
    //dest:'avatar',
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
           return cb(new Error('Please upload an image')) 
        } 
        cb(undefined, true)
    }

})


//saving image as binary file
router.post('/users/me/avatar', auth, upload.single('avatar'),async (req,res)=>{
    
    const buffer = await sharp(req.file.buffer).resize({width:250, height:259}).png().toBuffer()
    
    req.user.avatar = buffer
    await req.user.save()    
    res.status(200).send('Profile image uploaded.')

}, (error, req, res, next)=>{
    res.status(400).send({error:error.message})
}) 



router.delete('/users/me/avatar', auth, async (req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send('Profile image deleted')
})

router.get('/users/:id/avatar', async(req, res)=>{

    try{

        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
                throw new Error('No image or user found')
        }
        // tell the requester than server is sending png or jpeg image(application/json by default)
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    }catch(e){
        res.status(404).send({error:e.message})
    }

})

router.post('/users/login', async (req, res)=>{

    try{

        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        //uses toJSON function in schema before sending user, only used for user(as it is associated with mongoose)
        res.status(201).send({user , token})
        //res.status(201).send({user : user.getPublicProfile(), token})
    }catch(e){
        res.status(400).send(e)
    }

})



//logout from a single device
router.post('/users/logout', auth, async(req, res)=>{

    try{

        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send('Logged Out')
    }catch(e){
        res.status(500).send()
    }

})

//logout from all devices
router.post('/users/logoutAll', auth, async(req, res)=>{

    try{
        req.user.tokens = []

        await req.user.save()
        res.send('Logged Out from All Devices.')
 
    }catch(e){
        res.status(500).send()
    }

})
 
router.get('/users/me', auth, async (req, res)=>{

    try{

        res.status(200).send(req.user)

    }catch(e){
        res.status(400).send(e)
    }

    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((error)=>{
    //     res.status(500).send(error)
})


router.post('/users', async (req, res)=>{
    const user = new User(req.body)
    try{

        await user.save()
        // send() by email returns a promise but no need to wait for email for generating tokens
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send(user)

    }catch(e){
        res.status(400).send(e)
    }
    
    
    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((error)=>{
    //     res.status(400)
    //     res.send(error)
    //     // or res.status(400).send(error)
    // })
})


router.patch('/users/me', auth, async (req,res)=>{

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const valid = updates.every((update)=> allowedUpdates.includes(update))

if(!valid){
    return res.status(400).send({'error':"Invalid updates"})
}
 
    try{
               
        updates.forEach((update)=>{
            req.user[update] = req.body[update]
        })
       
        // or updates.forEach((update)=> user[update] = req.body[update] )
 
        await req.user.save()
        res.send(req.user)
        //new : true, means new user is retured to const user, that is req.body is returned 
        // findbyid and update bypasses mongoose so we need to use traditional way to use schema
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})

    } catch(e){
            res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req,res)=> {

    try{
        //deleted user get assigned to const user
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //    res.status(404).send({"error":"No user id found"})
        // }
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send({user : req.user, message:'delete'})

    }catch(e){
        res.status(500).send(e)
    }

})

module.exports = router


