import { createRoomCategoryDto } from "../dto/createRoomCategory.dto";
import { HotelRepository } from "../repositories/hotel.repository";
import RoomCategoryRepository from "../repositories/roomCategory.repository";
import { NotFoundError } from "../utils/errors/app.error";

const roomCategoryRepository=new RoomCategoryRepository()
const hotelRepository=new HotelRepository()

export async function createRoomCategoryService(createRoomCategoryDto:createRoomCategoryDto){
    const roomCategory=await roomCategoryRepository.create(createRoomCategoryDto)
    return roomCategory
}

export async function getRoomCategoryByIdService(id:number){
    const roomCategory=await roomCategoryRepository.findById(id)
    return roomCategory
}

export async function getAllRoomCategoriesByHotelIdService(hotelId:number){
    const hotel=await hotelRepository.findById(hotelId)
    if(!hotel){
        throw new NotFoundError(`No Hotel found by id ${hotelId}`)
    }
    const roomCategories=roomCategoryRepository.findAllByHotelId(hotelId)

    return roomCategories
}


export async function deleteRoomCategoryById(id:number){
    const roomCategory=roomCategoryRepository.findById(id)
    if(!roomCategory){
        throw new NotFoundError(`No roomCategory with id: ${id} found`)
    }

    await roomCategoryRepository.deleteById({id})
    return true
}