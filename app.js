const express=require('express')
const app=express()
app.use(express.urlencoded({extended:false}))
const session=require('express-session')
const mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/expressprojectlifestyle')
const adminRouter=require('./router/admin')
const frontendRouter=require('./router/frontend')




app.use(session({
    secret:'swastik',
    resave:false,
    saveUninitialized:false
}))
app.use('/admin',adminRouter)
app.use(frontendRouter)

app.use(express.static('public'))
app.set('view engine',"ejs")
app.listen(5000)