//jshint esversion:6
require('dotenv').config();
const express=require('express');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption')

const app=express();

mongoose.connect("mongodb://localhost:27017/secret",{useNewUrlParser:true})

app.listen(3000,function(err){});

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
  res.render('home')
})
app.get('/register',function(req,res){
  res.render('register')
})
app.get('/login',function(req,res){
  res.render('login')
})



const userSchema =mongoose.Schema({
  email:String,
  password:String
});


userSchema.plugin(encrypt,{secret:process.env.MYSECRET,encryptedFields:["password"] });
const User=new mongoose.model("User",userSchema);

app.post('/register',function(req,res){

  const useMe=new User({
    email:req.body.username,
    password:req.body.password
  })

  useMe.save(function(err){
    if(err){
      console.log(err)
    }else{
      res.render("secrets");
    }
  })

})

app.post('/login',function(req,res){
  const username=req.body.username
  const pass=req.body.password
  User.findOne({email:username},function(err,founditem){
    if(err){
      console.log(err);
    }else{
      if(founditem.password===pass){
        res.render("secrets");
      }
    }

  })

})
