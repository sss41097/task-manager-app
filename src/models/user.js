const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
       
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
            throw new Error('Password cannot contain "Password"')
            }
        }
    },
    email:{
        type:String,
        //unique email
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
           if(!validator.isEmail(value)){
               throw new Error('Email is invalid')
           }     
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be positive number')
            }
        }                    
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
}, {
    timestamps:true
})

//this brings all those tasks whose owner matches with user _id
userSchema.virtual('tasks',{

ref:'Tasks',
localField:'_id',
foreignField:'owner'

})

// methods used for user, statics used for User(full object)

//toJSON is called every time res is used in router, since res stringify the JSON object, and it passes it through toJSON to stringify
userSchema.methods.toJSON = function(){
    const user = this
    //raw object, it removes mongoose operations on it like save()
    const userObject = user.toObject()
    //console.log(user)
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}


// userSchema.methods.getPublicProfile = function(){
//     const user = this
//     //raw object, it removes mongoose operations on it like save()
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens

//     return userObject
// }


userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id:user.id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    user.save()
    return token
}


userSchema.statics.findByCredentials = async (email, password) =>{

    const user = await User.findOne({email})
    if(!user){
        throw new Error("Unable to find an associated email address.")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        console.log('mismatch')
        throw new Error('Unable to login')
    }

    return user
}



//hashing password
// do not use arrow functon as it does not provide this binding
userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        // 8 rounds of encryption
        user.password = await bcrypt.hash(user.password, 8)
    }

    // if next is not used it will be inside this function forever
    next()

})


userSchema.pre('remove', async function(next){
    console.log('Oooo yeah')
    const user = this
    await Task.deleteMany({owner:user._id})
    next()
 })                                                                             


const User = mongoose.model('User',userSchema)


module.exports = User