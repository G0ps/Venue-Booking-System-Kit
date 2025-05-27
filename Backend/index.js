import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();
const PORT = process.env.PORT || 3000;
const mongourl = process.env.MONGO_URL;

const app = express();

//connecting mongo db backend
mongoose.connect(mongourl)
.then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT,()=>{
        console.log("App Connected to port");
    });
}) 
.catch((error) => {
    console.log("Error occured");
});

//schema and model design 
const userschema = new mongoose.Schema({
    name:String,
    role:String
});
const usermodel = mongoose.model("User_Role" , userschema , "User_Role");


// Methods handling 
app.get("/getUsers" , async(req , res)=>{
    console.log("Request for 'User to Role' arrived");  
    const userdata = await usermodel.find();
    console.log(userdata);
    
    res.send(userdata);
});