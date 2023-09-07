const mongoose=require('mongoose')



const serviceSchema=mongoose.Schema({
    img:String,
    title:String,
    desc:String,
    ldesc:String,
    status:String,
    posteddate:Date
})







module.exports=mongoose.model('service',serviceSchema)