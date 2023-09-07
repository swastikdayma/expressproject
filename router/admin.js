const router=require('express').Router()
const Reg=require('../models/adminreg')
const Banner=require('../models/banner')
const multer=require('multer')
const nodemailer= require("nodemailer")
const Query=require('../models/query')
const Service=require('../models/service')
const service = require('../models/service')
const Testi=require('../models/testi')
const Reguser=require('../models/reg')
const Parking=require('../models/parking')
const Footer=require('../models/footer')


let storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/upload')
    },
    filename:function(req,file,cb){
        cb(null, Date.now()+file.originalname)
    }
})


let upload=multer({
   storage:storage,
   limits:{fileSize:1024*1024*4}
})

function handlelogin(req,res,next){
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/admin/')
    }
}

router.get('/',(req,res)=>{
    res.render('admin/login.ejs')
})
 router.post('/loginrecord',async(req,res)=>{
    const{us,pass}=req.body
    const record=await Reg.findOne({username:us})
    //console.log(record)
    if(record!==null){
        if(record.password==pass){
            req.session.isAuth=true
        res.redirect('/admin/dashboard')
        }else{
            res.redirect('/admin/')
        }
    }else{
        res.redirect('/admin/')
    }

 })
 router.get('/dashboard',handlelogin,(req,res)=>{
    res.render('admin/dashboard.ejs')
 })
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/admin/')
})
router.get('/banner',async(req,res)=>{
  const record= await Banner.findOne()
    res.render('admin/banner.ejs',{record})
})
router.get('/bannerupdate/:id',async(req,res)=>{
   
    const id = req.params.id
   const record= await Banner.findById(id)
    res.render('admin/bannerupdate.ejs',{record})
})
router.post('/updaterecord/:id',upload.single('img'),async(req,res)=>{
   
    const id=req.params.id
    const{title,desc,ldesc}=req.body
    if(req.file){
    const imgname=req.file.filename
    await Banner.findByIdAndUpdate(id,{title:title,desc:desc,ldesc:ldesc,img:imgname})
    res.redirect('/admin/banner')
    }else{
        await Banner.findByIdAndUpdate(id,{title:title,desc:desc,ldesc:ldesc}) 
        res.redirect('/admin/banner')
    }
   
})
router.get('/query',async(req,res)=>{
    const record=await Query.find().sort({posteddate:-1})
    res.render('admin/query.ejs',{record})
})
router.get('/queryreply/:id',(req,res)=>{
    const id = req.params.id
    res.render('admin/queryreply.ejs',{id})
})
router.post('/queryrecord/:id',upload.single('attachment'),async(req,res)=>{
    const filepath=req.file.path
    const id = req.params.id
    const{emailto,emailfrom,sub,body}=req.body
    const record= await Query.findById(id)
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'shyam170025@gmail.com', // generated ethereal user
        pass: 'kuosyitsgfqxpkel', // generated ethereal password
      },
    });
    let info = await transporter.sendMail({
        from:'shyam170025@gmail.com', // sender address
        to:record.email, // list of receivers
        subject:sub, // Subject line
        text:body, // plain text body
       // html: "<b>Hello world?</b>", // html 
       attachments:[{
        path:filepath
       }]
      });
      await Query.findByIdAndUpdate(id,{status:'read'})
    res.redirect('/admin/query')

})
 router.get('/querydelete/:id',async(req,res)=>{
    const id = req.params.id
    await Query.findByIdAndDelete(id)
    res.redirect('/admin/query')
 })
router.get('/service',async(req,res)=>{
    const totalservices = await Service.count()
    const publishservices = await Service.count({status:'publish'})
    const unpublishservices = await Service.count({status:'unpublish'})

     const record=await Service.find().sort({posteddate:-1})
    res.render('admin/service.ejs',{record,totalservices,publishservices,unpublishservices})
})

router.get('/serviceadd',(req,res)=>{
    res.render('admin/serviceadd.ejs')
})
router.post('/serviceupdate',upload.single('img'),async(req,res)=>{
    const imgname=req.file.filename
  const{title,desc,ldesc}=req.body
  
  
  const record=new service({title:title,img:imgname,desc:desc,ldesc:ldesc,status:'unpublish',posteddate:new Date()})
  await record.save()
  res.redirect('/admin/service')
})
router.get('/servicestatus/:id',async(req,res)=>{
    const id=req.params.id
    const record=await Service.findById(id)
    let  newstatus=null
    if(record.status=='unpublish'){
        newstatus='publish'
    }else{
        newstatus='unpublish'
    }
    await Service.findByIdAndUpdate(id,{status:newstatus})
    res.redirect('/admin/service')



})
router.get('/servicedelete/:id',async(req,res)=>{
    const id=req.params.id
await Service.findByIdAndDelete(id)
res.redirect('/admin/service')

})
router.get('/testi',async(req,res)=>{
   const record=await Testi.find().sort({posteddate:-1})
   const totalcount=await Testi.count()
   const publishcount=await Testi.count({status:'publish'})
   const unpublishcount=await Testi.count({status:'unpublish'})
    res.render('admin/testi.ejs',{record,totalcount,unpublishcount,publishcount})
})
router.get('/statusupdate/:id',async(req,res)=>{
  const id=req.params.id
 const record= await Testi.findById(id)
 let newstatus=null
 if(record.status=='unpublish'){
    newstatus='publish'
 }else{
    newstatus='unpublish'
 }
 await Testi.findByIdAndUpdate(id,{status:newstatus})
 res.redirect('/admin/testi')

})
router.get('/delete/:id',async(req,res)=>{
    const id=req.params.id
   await Testi.findByIdAndDelete(id)
   res.redirect('/admin/testi')
})

router.get('/reg',async(req,res)=>{
 const record= await Reguser.find().sort({createdDate:-1})
    res.render('admin/reg.ejs',{record})
})
router.get('/userstatus/:id',async(req,res)=>{
   const id=req.params.id
   const record=await Reguser.findById(id)
   let newstatus=null
   if(record.status=='suspended'){
    newstatus='active'
   }else{
    newstatus='suspended'
   }
   await Reguser.findByIdAndUpdate(id,{status:newstatus})
   res.redirect('/admin/reg')
})
router.get('/roleupdate/:id',async(req,res)=>{
    const id=req.params.id
   const record= await Reguser.findById(id)
   let newrole=null
    if(record.role=='public'){
        newrole='pvt'
       }else{
        newrole='public'
       }
    await Reguser.findByIdAndUpdate(id,{role:newrole})
    res.redirect('/admin/reg')
})
router.get('/parking',async(req,res)=>{
  const record=await Parking.find()
    res.render('admin/parking.ejs',{record})
})
router.get('/parkingadd',(req,res)=>{
    res.render('admin/parkingadd.ejs')
})
router.post('/parkingupdate',async(req,res)=>{
    const{vno,vtype,etime}=req.body
   const record= new Parking({vno:vno,vtype:vtype,vin:etime})
    await record.save()
    res.redirect('/admin/parking')
})
router.get('/parkingstatusupdate/:id',async(req,res)=>{
    const id=req.params.id
    res.render('admin/parkingout.ejs',{id})

})
router.post('/parkingoutupdate/:id',async(req,res)=>{
    const id=req.params.id
    const{vout}=req.body
  const record = await Parking.findById(id)
  const totaltime= vout-record.vin
 // console.log(totaltime)
   let amount=0
   if(record.vtype=='2w'){
    amount=totaltime*20
   }else if(record.vtype=='3w'){
    amount=totaltime*30
   }else if(record.vtype=='4w'){
    amount=totaltime*40
   }else if(record.vtype=='hw'){
    amount=totaltime*80
   }else if(record.vtype=='lw'){
    amount=totaltime*50
   }
   await Parking.findByIdAndUpdate(id,{vout:vout,amount:amount,status:"OUT"})
   res.redirect('/admin/parking')

   
})
router.get('/parkingprint/:id',async(req,res)=>{
    const id=req.params.id
    const record= await Parking.findById(id)
    res.render('admin/print.ejs',{record})
})
router.get('/footer',async(req,res)=>{
 const record=  await Footer.findOne()
    res.render('admin/footer.ejs',{record})
})
router.get('/footerupdate',async(req,res)=>{
    const record=await Footer.findOne()
    res.render('admin/footerupdate.ejs',{record})

})

router.post('/footerupdaterecord',async(req,res)=>{
    const{desc,cname,address,mnumber,tnumber}=req.body
    await Footer.findOneAndUpdate({desc:desc,cname:cname,address:address,mnumber:mnumber,tnumber:tnumber})
    res.redirect('/admin/footer')

})


  
module.exports=router 