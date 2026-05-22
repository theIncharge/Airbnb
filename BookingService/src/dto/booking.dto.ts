export type CreateBookingDto = {
    userId: number;
    hotelId: number;
    checkInDate: string; // ISO date string
    checkOutDate: string; // ISO date string
    totalGuests: number;
    roomCategoryId:number
    bookingAmount:number
}