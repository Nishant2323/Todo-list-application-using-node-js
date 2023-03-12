//jshint eversion-6
const express= require("express");
const bodyparser= require("body-parser");
const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://root:root@cluster0.zaso0wp.mongodb.net/todolistDB",{useNewUrlParser:true})
const ListSchema= {
   name:String
}
const Item=mongoose.model("Item",ListSchema);
const item =new Item({
    name:"welcome "
})
const item1 =new Item({
    name:"enter the work you want to do "
})
const item2 =new Item({
    name:"deleteit by pressing the check box "
})
const app =express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
var items=[item,item1,item2];
const listSchema ={
    name: String,
    it: [ListSchema]
};
const List = mongoose.model("List",listSchema)
var worklist=[];

app.get("/",function(req,res){
    var today=new Date();
   var option={
    weekday:'long',
    day:'numeric',
    month:'long'
   };
  var d=today.toLocaleDateString("en-US",option);
  Item.find({},{name:1}, function(err, founditems){
    
 if(founditems.length===0)
    {
        Item.insertMany(items,function(err){
            if(err)
            {
                console.log(err);
            }
            else{
                console.log("sussfully inserted")
            }
        })
        res.redirect("/"); 
    }
    
    else{
        res.render('index',{kindofday:"today",newitem:founditems});
    }
  }) 

})
app.post("/",function(req,res)
{   

    var itemname=req.body.i;
    var append = req.body.append;
    const itemList = new Item({
        name: itemname
    })
    if(append==="today")
    {
        itemList.save()
        res.redirect("/");
    }
    else{
        List.findOne({name:append},function(err,founditems)
        {

            founditems.it.push(itemList);
            founditems.save();
            res.redirect("/"+append);
        })
    }
    
})
app.post("/delete", function(req,res){
    const deleteitem = req.body.checkbox;
    const listName = req.body.listName;
    if(listName === "today"){
        Item.deleteOne({_id:deleteitem},function(err){
            if(!err){
                console.log("successfully deleted")
                res.redirect("/")
            }
            
        })
    }
    else{
        List.findOneAndUpdate({name: listName},{$pull: {it:{_id:deleteitem}}}, function(err, founditems){
            if(!err){
                console.log(founditems);
                res.redirect("/" + listName);
            }
        });
        
        
    }


    
   
})

app.get("/:customlistname",function(req,res){
    const customlistname = req.params.customlistname;
     List.findOne({name:customlistname},function(err,founditems){
        if(!err)
        {
            if(!founditems)
            {
                const list =new List({
                    name:customlistname,
                    it:items
                })
                list.save();
                res.redirect("/"+customlistname);
            }
            else
            {
                res.render('index',{kindofday:founditems.name,newitem:founditems.it})
            }
        }
     })

})

app.listen(process.env.PORT||8000,function(){
    console.log("server has started");
})