import { PrismaClient } from "@prisma/client/extension";
import { Prisma} from "../prisma/generated/client";

export async function createBooking(bookingInput:Prisma.BookingCreateInput){
    const booking =await PrismaClient.booking.createBooking({
        data: bookingInput
    })
    return booking
}