const mongoose=require('mongoose')



const footerSchema=mongoose.Schema({
      desc:String,
      cname:String,
      address:String,
      mnumber:Number,
      tnumber:Number
})






module.exports= mongoose.model('footer',footerSchema)