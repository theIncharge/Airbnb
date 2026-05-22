import { z } from "zod";

export const getAvailableRoomSchema=z.object({
    roomCategoryId:z.string({message:"Room category must be present"}),
    checkInDate:z.number({message:"Checkin date must be present"}),
    checkOut:z.number({message:"Check out must be present"}),
})

export const updateBookingIdToRoomSchema=z.object({
    bookingId:z.number({message:"Booking Id must be present"}),
    roomIds:z.array(z.number({message:"Room ids must be present"}))
})