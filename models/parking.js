const mongoose=require('mongoose')



const parkingSchema=mongoose.Schema({
   vno:String,
   vtype:String,
   vin:Number,
   vout:{type:Number,default:0},
   amount:{type:Number,default:0},
   status:{type:String,default:'IN'}


})







module.exports=mongoose.model('parking',parkingSchema)