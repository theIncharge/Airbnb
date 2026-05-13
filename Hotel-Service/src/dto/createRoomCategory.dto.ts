import { RoomType } from "../db/models/roomCategory"


export type createRoomCategoryDto={
    roomType:RoomType,
    price:number,
    hotelId:number,
    roomCount:number
}