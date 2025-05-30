import * as urls from './urls.mjs';

export const venueValidator = async function(venue) {
    try{
        if(venue.name && typeof(venue.name) === "string" && typeof(venue.capacity) === "number" && venue.capacity >= 1 )
        {
            return {"validity" : true };
        }

        return {"validity" : false}; // or some logic using `data` to determine validity
    } catch (error) {
        console.error("Validation error:", error);
        return false;
    }
}

// -- for booking --
export const validBooking = async (bookingDetails) =>
{
    return {"validity" : true};
}
export const timevalidation = async (arr) => 
{
    //a 2d array of size  4 will come containing [start time hh , start time mm , end time hh , end time mm] validate it. 
    return true; 
}
 //("BOOKED_TIMINGS_OF_THIS_PARTICULAR_VENUEID")