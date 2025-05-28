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
