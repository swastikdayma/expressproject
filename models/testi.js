const mongoose=require('mongoose')



const testiSchema=mongoose.Schema({
    img:String,
    testi:String,
    cname:String,
    posteddate:Date,
    status:{type:String,default:'unpublish'}
    
    
})







module.exports=mongoose.model('testi',testiSchema)