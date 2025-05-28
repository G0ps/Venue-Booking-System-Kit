import express from "express";
import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";
import cors from 'cors';

import * as urls from '../urls.mjs';
import * as validators from '../validators.mjs';


dotenv.config();
const PORT = process.env.PORT || 3000;
const mongourl = process.env.MONGO_URL;

const app = express();
app.use(cors());
app.use(express.json());

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



// Methods handling user_Role mapping(test)
//schema and model design 
const userschema = new mongoose.Schema({
    name:String,
    role:String
});
const usermodel = mongoose.model("User_Role" , userschema , "User_Role");
app.get(`${urls.usertorolesendpoint}`,async (req , res)=>{
    console.log("Request for 'User to Role' arrived");  
    const userdata = await usermodel.find();
    console.log(userdata);
    
    res.send(userdata);
});




//the HOD type of users who can controll venues 



//---------------------------------venues CRUD--------------------------------------
//schema for adding venue to the db
const venuecreationschema = new mongoose.Schema({
    "VenueName": String,
    "Capacity": Number
});
const venuecreationmodel = new mongoose.model("Venues" , venuecreationschema , "Venues");
//this is not only venue creaion model , this is just a venue model with which we can querry the venue collection of our db

//--creating a new venue
app.post(urls.createvenue, async (req, res) => {
  // the post data payload , will come as body with the request
    console.log(req.body);
    const {validity} = await validators.venueValidator(req.body);
    
    if(validity === true)
    {
        //data arival verified
        const newVenue = await venuecreationmodel.create({
        VenueName: req.body.name,
        Capacity: Math.floor(Number(req.body.capacity))

        });

        res.status(201).json({ message: "Venue created successfully", venue: newVenue });
        }
    else {
        res.json(
        {
            success: false,
            message: "Venue details are not valid",
        }
        );
    }
});

//--updatng venue & --get venues(false in cancreate)
/*the request expected will be
    {
        cancreate   : true,
        venueid     : Number or string,
        venueName   : String,
        capacity    : Number
            if true -> update the element 
    }
    or
    {
        cancreate   : false,
        venueid     : Number or string

            this should return the venue like it is "get venue by id"
    }
*/
app.post(urls.updatevenue , async (req , res) => {
    if(!req.body)
    {
        res.status(101).json({
            message : "The request came does not have a body containing 'venue id'"
        });
    }
    if(!req.body.cancreate)
    {
        if(!req.body.venueid)
        {
            res.status(101).json({
                ans : false,
                message : "THE request recieved but no id for finding"
            });
        }
        let data = await venuecreationmodel.findById(req.body.venueid);
        res.json(data);
    }
    else{
        try{
            if(!req.body.venueid)
            {
                res.status(101).json({
                    ans : false,
                    message : "THE request recieved but no id for finding"
                });
            }
            if(validators.venueValidator(req.body))
            {
                await venuecreationmodel.findByIdAndUpdate(
                req.body.venueid,         
                { $set: { Capacity: req.body.capacity  , VenueName : req.body.venueName} },         
                { new: true }                        
                );
                res.json({
                    ans : true,
                    status : "Success",
                    message : "Updated sucessfully...",
                });
            }
            else{
                res.status(101).json({
                    ans : false,
                    message : "Invalid data retry later"
                });
            }
        }
        catch(error){
            res.json({
                ans : false,
                error : "theerror"
            });
        }
    }

});

// --delete venues
/* request :
    {
        venueid : Number or string
    }
*/
app.delete(urls.deletevenue , async (req , res) => {
        try{
            if(!req.body.venueid)
            {
                res.status(101).json({
                    ans : false,
                    message : "THE request recieved but no id for finding"
                });
            }
            await venuecreationmodel.findByIdAndDelete(req.body.venueid);
            res.json({
                status      : 'success',
                ans         : true,
                message     : "Successfully deleted"
            });
        }
        catch(error)
        {
            res.json({
                "Error occured : " : error,
                 ans               : false
            });
        }
});
//++++++++++++++++++++++++++++++venues CRUD +++++++++++++++++++++++++++++++++++++++++

