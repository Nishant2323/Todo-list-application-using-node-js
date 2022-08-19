//jshint eversion-6
const express= require("express");
const bodyparser= require("body-parser");
const app =express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
var items=["wake up"];
var worklist=[];
app.get("/",function(req,res){
    var today=new Date();
   var option={
    weekday:'long',
    day:'numeric',
    month:'long'
   };
  var d=today.toLocaleDateString("en-US",option);
    res.render('index',{kindofday:d,newitem:items});

})
app.post("/",function(req,res)
{   

    var item=req.body.i;
    items.push(item);
    res.redirect("/");
})
app.get("/work",function(req,res)
{
    res.render("index",{kindofday:"work",newitem:worklist});  
});

app.listen(process.env.PORT||3000,function(){
    console.log("server has started");
})