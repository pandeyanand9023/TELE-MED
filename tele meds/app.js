const express=require("express");
const request=require("request");
const ejs = require("ejs");
const bodyParser=require("body-parser");
const https=require("https");
const mongoose=require("mongoose");
const session=require('express-session');
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const app=express();
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.use(session({
secret:"Our little secret",
resave: false,
saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-anand:Test123@cluster0.gpto1.mongodb.net/userDB",{useNewUrlParser:true});
mongoose.set("useCreateIndex",true);
const userSchema=new mongoose.Schema({
  username: String,
  name:String,
  phone:Number,
  password: String,
  value:Number
});

userSchema.plugin(passportLocalMongoose);
const User=new mongoose.model("User",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
res.sendFile(__dirname+"/index.html");
});
app.get("/sign_up.html",function(req,res){
res.sendFile(__dirname+"/sign_up.html");
});
app.get("/login.html",function(req,res){
res.sendFile(__dirname+"/login.html");
});

app.get("/log_error.html",function(req,res){
res.sendFile(__dirname+"/log_error.html");
});

app.get("/sign_error.html",function(req,res){
res.sendFile(__dirname+"/sign_error.html");
});


app.get("/newpage",function(req,res)
{
 if(req.isAuthenticated())
  {
   res.render("newpage");
  }
  else
  {
   res.sendFile("/login.html");
  }
});
app.get("/newpage1",function(req,res){
  User.find({value:"2"},function(err,findItems){
    res.render("newpage1",{newListItems:findItems
    });
    } );

});
app.get("/newpage2",function(req,res){
  User.find({value:3},function(err,findItems){
    res.render("newpage2",{newListItems:findItems
    });
    } );

});
app.get("/newpage3",function(req,res){
  User.find({value:4},function(err,findItems){
    res.render("newpage3",{newListItems:findItems
    });
    } );

});

app.get("/logout",function(req,res){
req.logout();
res.sendFile(__dirname+"/index.html");
});



app.post("/sign_up.html",function(req,res){
  User.register(({username:req.body.username,
    name:req.body.name,
    phone:req.body.phone,
    value:req.body.profession}),req.body.password,function(err,user)
 {   if(err)
    {
    console.log(err);
     res.sendFile(__dirname+"/sign_error.html");
     }
  else
   {
     passport.authenticate("local")(req,res,function(){
       User.find({value:1},function(err,findItems){
         res.render("newpage",{newListItems:findItems});
         } );
       });
    }
  });
});

app.post("/login.html",function(req,res){
const user=new User({
username:req.body.username,
password:req.body.password
});
  req.login(user,function(err)
{
   if(err){
   console.log(err);
    res.sendFile(__dirname+"/log_error.html");
  }
   else{
     passport.authenticate("local")(req,res,function(){
       User.find({value:1},function(err,findItems){
         res.render("newpage",{newListItems:findItems});
         } );

       });
   }
})

});
let port=process.env.PORT;
if(port==null || port=="")
port=3000;

app.listen(port,function(){
  console.log("Server has started");
});
