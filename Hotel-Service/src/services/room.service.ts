import { GetAvailableRoomsDto, UpdateBookingIdToRoomsDto } from "../dto/room.dto"
import { RoomRepository } from "../repositories/room.repository"

const roomRepository=new RoomRepository()

export async function getAvailableRoomsService(getAvailableRooms:GetAvailableRoomsDto){
     const rooms=await roomRepository.findByRoomCategoryIdAndDateRange(getAvailableRooms.roomCategoryId,new Date(getAvailableRooms.checkInDate),new Date(getAvailableRooms.checkOutDate))
     return rooms
}


export async function updateBookingIdToRoomService(updateBookingIdToRoomsDto:UpdateBookingIdToRoomsDto){
    return await roomRepository.updateBookingIdToRooms(updateBookingIdToRoomsDto.bookingId,updateBookingIdToRoomsDto.roomIds)
}