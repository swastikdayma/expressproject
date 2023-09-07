const mongoose=require('mongoose')


const regSchem=mongoose.Schema({
    username:String,
    password:String,
    firstName:String,
    lastName:String,
    email:String,
    img:String,
    createdDate:{type:Date,default:new Date()},
    status:{type:String,default:'suspended'},
    role:{type:String,default:'public'}
})






module.exports=mongoose.model('reg',regSchem)