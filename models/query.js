const mongoose=require('mongoose')



const querySchema=mongoose.Schema({
    email:String,
    query:String,
    status:String,
    posteddate:{type:Date,default:new Date()}
})







module.exports=mongoose.model('query',querySchema)