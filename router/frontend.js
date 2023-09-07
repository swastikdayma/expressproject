const router=require('express').Router()
const Banner=require('../models/banner')
const Query=require('../models/query')
const Service=require('../models/service')
const Testi=require('../models/testi')
const multer=require('multer')
const Reg=require('../models/reg')
const Footer=require('../models/footer')
    

let sess=null;

function handlelogin(req,res,next){
    if(req.session.isAuth){
        next()
    }else{
        res.redirect('/login')
    }

}
 function handlerole(req,res,next){
    if(sess.role==='pvt'){
    next()
    }else{
        res.send('You dont have rights')
    }
}

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




router.get('/',handlelogin,async(req,res)=>{
    const record=await Banner.findOne()
    const servicedata=await Service.find({status:"publish"})
   const testidata= await Testi.find({status:"publish"})
   const footerdata= await Footer.findOne()
   if(sess!==null){
    res.render('index.ejs',{record,servicedata,testidata,username:sess.username,footerdata})
}else{
    res.render('index.ejs',{record,servicedata,testidata,username:'hello',footerdata})
}
})
router.get('/banner',async(req,res)=>{
    const record=await Banner.findOne()
    if(sess!==null){
        res.render('banner.ejs',{record},{username:sess.username})
    }else{
        res.render('banner.ejs',{record},{username:'hello'})
    }
    
})
router.post('/queryrecord',async(req,res)=>{
    const{email,query}=req.body
   const record= new Query({email:email,query:query,status:'unread'})
    await record.save()
    res.redirect('/')

})
router.get('/servicedetails/:id',async(req,res)=>{
    const id=req.params.id
    const record=await Service.findById(id)
    res.render('servicedetails.ejs',{record})
})
router.get('/testi',handlelogin,handlerole,(req,res)=>{
    if(sess!==null){
    res.render('testi.ejs',{username:sess.username})
    }else{
        res.render('testi.ejs',{username:"hello"})
    }
})
router.post('/testirecord',upload.single('img'),async(req,res)=>{
    const imgname=req.file.filename
    const{qt,cname}=req.body
    const record= new Testi({img:imgname,testi:qt,cname:cname,posteddate:new Date()})
     await record.save()
     res.redirect('/')
})
router.get('/reg',(req,res)=>{
    if(sess!==null){
        res.render('reg.ejs',{username:sess.username})
    }
    res.render('reg.ejs',{username:'hello'})
})
router.post('/regrecord',async(req,res)=>{
    const{us,pass}=req.body
   const usercheck= await Reg.findOne({username:us})
   if(usercheck==null){
    const record= new Reg({username:us,password:pass})
    await record.save()
    
   }else{
    res.send('already registered')
   }
  
   //console.log(record)


})
router.get('/login',(req,res)=>{
    if(sess!==null){
    res.render('login.ejs',{message:'',username:sess.username})
    }else{
        res.render('login.ejs',{message:'',username:'hello'})
    }
})

router.post('/loginrecord',async(req,res)=>{
    const{us,pass}=req.body
   const record=await Reg.findOne({username:us})
   if(record!==null){
    if(record.password==pass){
        if(record.status=='active'){
        req.session.isAuth=true
        sess=req.session
        sess.username=us
        sess.role=record.role
    res.redirect('/')
    }else{
        res.send('Your Account Is Suspended')
    }
    }else{
        if(sess!==null){
            res.render('login.ejs',{message:'wrong credentials',username:sess.username})
            }else{
                res.render('login.ejs',{message:'wrong credentials',username:'hello'})
            }
    }
   }else{
    if(sess!==null){
        res.render('login.ejs',{message:'wrong credentials',username:sess.username})
        }else{
            res.render('login.ejs',{message:'wrong credentials',username:'hello'})
        }
   }
    
})
router.get('/logout',(req,res)=>{
    req.session.destroy()
    sess=null;
    res.redirect('/login')
})
router.get('/profile',handlelogin,async(req,res)=>{
    if(sess!==null){
  const record=await Reg.findOne({username:sess.username})
    res.render('profile.ejs',{message:'',record,username:sess.username })
    }else{
        res.render('profile.ejs',{message:'',username:'hello'})
    }
})
router.post('/profile/:id',upload.single('img'),async(req,res)=>{
    const id=req.params.id
    const{fname,lname,email}=req.body
    if(req.file){
    const imgfilename=req.file.filename
    await Reg.findByIdAndUpdate(id,{ firstName:fname,lastName:lname,email:email,img:imgfilename})
   
    }else{
        await Reg.findByIdAndUpdate(id,{ firstName:fname,lastName:lname,email:email})
    }
    if(sess!==null){
        const record=await Reg.findOne({username:sess.username})
          res.render('profile.ejs',{message:'updated successfully',record,username:sess.username })
          }else{
              res.render('profile.ejs',{message:'updated successfully',username:'hello'})
          }


})
router.get('/password',(req,res)=>{
    if(sess!==null){
        res.render('password.ejs',{username:sess.username})
    }else{
        res.render('password.ejs',{username:'hello'})
    }
   
})
router.post('/password',handlelogin,async(req,res)=>{
    const{cpass,npass}=req.body
   const record= await Reg.findOne({username:sess.username})
   if(record.password==cpass){
    const id=record.id
    await Reg.findByIdAndUpdate(id,{password:npass})
    res.redirect('/password')
   }else{
    res.send('current password not matched')
   }
})











module.exports=router