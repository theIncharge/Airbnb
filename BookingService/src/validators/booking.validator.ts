import {z} from "zod"
export const creatingBookingScheme=z.object({
    userId:z.number({message:"User ID must be present"}),
    hotelId:z.number({message:"hotelId must ne number"}),
    totalGuests:z.number({message:"Total guests must be in number"}).min(1,{message:"Guests can not be less than 1"}),
    bookingAmount:z.number({message:"Booking amount must be in number"}).min(1,{message:"Booking amount can not be zero"})

})