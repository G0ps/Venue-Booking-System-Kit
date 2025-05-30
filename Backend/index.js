import express from 'express'
import mongoose, { Schema } from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import * as urls from '../urls.mjs'
import * as validators from '../validators.mjs'

dotenv.config()
const PORT = process.env.PORT || 3000
const mongourl = process.env.MONGO_URL

const app = express()
app.use(cors())
app.use(express.json())



// ---------------------------- DATABASE ----------------------------------------
// -CONNECTION
mongoose
  .connect(mongourl)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log('App Connected to port')
    })
  })
  .catch(error => {
    console.log('Error occured')
  })
// SCHEMA , INDEX AND MODEL
// USER TO ROLE 
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    CollegeId: {
      type: String,
      required: true
    },
    Name: {
      type: String,
      required: true
    },
    Role: {
      type: String,
      required: true
    }
  },
  { collection: 'User_Role' })
userSchema.index({ CollegeId: 1 }, { unique: true })
const userModel = mongoose.model('User_Role', userSchema, 'User_Role')

// VENUES
const venueSchema = new mongoose.Schema(
  {
    VenueName: {
      type: String,
      required: true
    },
    Capacity: {
      type: Number,
      min: 1,
      required: true
    }},{ collection: 'Venue_Creation' });
const venuesModel = new mongoose.model('Venues',venueSchema,'Venues')

// BOOKINGS
const BookingSchema = new mongoose.Schema({
    venueid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Venues'
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User_Role'
    },
    date: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    booked_timings: {
      type: [[Number]], // array of arrays of 4 numbers
      validate: {
        validator: validators.timevalidation,
        message:
          'Each booked_timing must be [startHour, startMin, endHour, endMin] with valid time values'
      }
    }
    // class_assigned: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: ""
    // },
    // score: Number, // below 20,
    // amenities: { type: Object }
  },{ collection: 'Venue_BookedTimings' })
BookingSchema.index(
  { venueid: 1, date: 1, booked_timings: 1 },
  { unique: true });
const bookingModel = new mongoose.model(
  'User_To_BookedTimings',
  BookingSchema,
  'User_To_BookedTimings')




// ---------------------------- API ---------------------------------------------
//GET
//VENUES
app.get(`${urls.getVenues}`, async (req, res) => {
  
  let action = req.query.action;
  //("ALL") all venues
  if(action === "ALL")
  {  
    try 
    {
      const venues_all = await venuesModel.find()
      res.json({ status: 'Success', content: venues_all })
    } 
    catch (error)
    {
      res.json({ message: 'Did not able to fetch the db', error: error.message })
    }
  }

  //("GET_BOOKED_TIMINGS_OF_THIS_PARTICULAR_VENUEID")
  else if(action === "GET_BOOKED_TIMINGS_OF_THIS_PARTICULAR_VENUEID")
  {
      try 
      {
        const venueid = req.query.venueid;
        if (venueid) {
          let venues = await bookingModel.find({ venueid: venueid })
          let venue_timings = []
          for (let i of venues) {
            for (let j of i.booked_timings) {
              venue_timings.push(j)
            }
          }

          res.json({ status: 'Success', content: venue_timings })
        } else {
          res.json({
            status: 'failed',
            error: 'Venue id didnot recieved',
            ids: [venueid, userid]
          })
        }
     } 
      catch (error) 
      {
        res.json({ message: 'Did not able to fetch the db', error: error.message })
      }
  }

  //("GET_VENUE_OF_THIS_PARTICULAR_VENUEID")
  else if(action === "GET_VENUE_OF_THIS_PARTICULAR_VENUEID")
  {
    let venueid = req.query.venueid;
    try
    {
      const data = await venuesModel.findOne({"_id" : venueid});
      res.json({status : "fetched successfully" , content : data});
    }
    catch (error) 
    {
      res.json({ message: 'Did not able to fetch the db', error: error.message })
    }
  }

})
//USERS
app.get(`${urls.getUsers}` ,async(req , res) =>{
  const action = req.query.action;

  //("ALL")
  if(action === "ALL")
  {
    try
    {
      const data = await userModel.find();
      res.json({"status" : "fetched sucessfully" , content : data});
    }
    catch(error)
    {
      res.json({status : "fetch failed" , error : error.message});
    }
  }

  //("GET_USER_WITH_HIS_COLLEGEID") 
  else if(action === "GET_USER_WITH_HIS_COLLEGEID")
  {
    const collegeid = req.query.collegeid;
    try 
    {
      const user = await userModel.findOne({ CollegeId: collegeid })
      if (user) 
      {
        res.json({ status: 'found', content: user })
      } 
      else 
      {
        res.json({ status: 'failed', error: 'no valid collegeid' })
      }
    } 
    catch (error) 
    {
      res.json({ status: 'failed', error: error.message })
    }
  }


})

//POST {body : {action : .... , content : ......}}
//VENUES
app.post(urls.manageVenue, async (req, res) => {
  const action = req.body.action;

  //("CREATE_NEW_VENUE")
  if(action === "CREATE_NEW_VENUE")
  {
    try
    {
        const newVenue = await venuesModel.create({
          VenueName           : req.body.content.name,
          Capacity            : Math.floor(Number(req.body.content.capacity)),
          RestrictedAmenities : req.body.content.restrictedAmenities
        })

        res.status(201).json({ status: 'Venue created successfully', content: newVenue });
    }
    catch(error)
    {
      res.json({status : "failed to create" , error : error.message});
    }
  }
  
  //("UPDATE_THE_VENUE_OF_THIS_PARTICULAR_VENUE_ID")
  else if(action === "UPDATE_THE_VENUE_OF_THIS_PARTICULAR_VENUE_ID")
  {
    const venueid = req.body.content.venueid;
    await venuesModel.findByIdAndUpdate(
          venueid,
          {
            $set:
            { 
              VenueName           : req.body.content.name,
              Capacity            : Math.floor(Number(req.body.content.capacity)),
              RestrictedAmenities : req.body.content.restrictedAmenities
            }
          },
          { new: true }
        );
    res.json({status : "updated successfully" , content:""});
  }


})
//BOOKINGS
app.post(`${urls.bookVenues}`, async (req, res) => 
{
  const action = req.body.action;

  //("CREATE_BOOKINGS")
  if(action === "CREATE_BOOKINGS") 
    {
      try 
      {
        const { venueid, booked_timings, collegeid, date, description,priorityPoints } = req.body.content;
        const userid = await userModel.findOne({CollegeId : collegeid});
        console.log(userid);
        await bookingModel.create({
          venueid,
          userid,
          booked_timings,
          date,
          description,
          priorityPoints
        });

        res.json({ status: 'Booking added successfully', content: req.body.content });
      } 
      catch (error) 
      {
        res.status(500).json({ error: 'Could not add booking to DB', details: error.message });
      }
    } 
  
})

//DELETE
//VENUES
app.delete(urls.deleteVenue, async (req, res) => {
  const action = req.body.action;
  
  //("DELETE_WITH_VENUE_ID")
  if(action === "DELETE_WITH_VENUE_ID")
  {
    try 
    {
      const venueid = req.body.content.venueid;
      await venuesModel.findByIdAndDelete(venueid);
      res.json({
        status: 'success',
        content:""
      })
    } 
    catch (error) 
    {
      res.json({status : "Deletion failed" , error : error.message});
    }
  }
})
