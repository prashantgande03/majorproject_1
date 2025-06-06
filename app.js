const express= require('express');
const app = express();
const mongoose = require('mongoose');
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapasync = require('./utils/wrapasync.js');
const ExpressError = require("./utils/ExpressError.js");
const {listingschema}=require("./schema.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main ()
.then(()=>{
    console.log("connected to mongoDB");
}).catch(err=>console.log(err));

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("root running");
});

//error handler for validation data
const validatelisting = (req,res,next)=>{
    let {error} = listingschema.validate(req.body);
    if (error){
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,result.error);
    }else{
        next();
    }
}

//index
app.get("/listing",wrapasync(async (req,res,next)=>{
    let list=await listing.find({});
    console.log(list);
    res.render("./listings/index.ejs",{list});
}));

//new
app.get("/listing/new",async (req,res)=>{   
    res.render("./listings/new.ejs")
});

//show route
app.get("/listings/:id",wrapasync(async (req,res,next)=>{
    let {id}=req.params;
    let Listing = await listing.findById(id);
    res.render("./listings/show.ejs",{Listing});
}));

//create route
app.post("/listings",validatelisting,wrapasync(async (req,res,next)=>{
    const newlisting= new listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listing");
}));

//edit route
app.get("/listing/:id/edit",wrapasync(async (req,res,next)=>{
    let {id}=req.params;
    let Listing = await listing.findById(id);
    res.render("./listings/edit.ejs",{Listing});
}));

//update route
app.put("/listings/:id",validatelisting,wrapasync(async (req,res,next)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
}));

//delete route
app.get("/listings/:id/delete",wrapasync(async (req,res,next)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));


//error handling for wrong route
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"page not found"));
// });try it later
app.use((req, res, next) => {
  const err = new Error("Page Not Found");
  err.statusCode = 404;
  next(err);
});


//error catch and show message
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong!"}=err;
    res.status(statusCode).render("./listings/error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8686,()=>{
    console.log("server is running on port 8686");
});