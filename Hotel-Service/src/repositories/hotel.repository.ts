import logger from "../config/logger.config";
import Hotel from "../db/models/hotel";
import { createHotelDto } from "../dto/hotel.dto";
import { NotFoundError } from "../utils/errors/app.error";

export async function createHotel(hotelData:createHotelDto){
    const hotel=await Hotel.create({
        name:hotelData.name,
        address:hotelData.address,
        location:hotelData.location,
        rating:hotelData.rating,
        ratingCount:hotelData.ratingCount,

    })
    logger.info(`hotel created: ${hotel.id}`)
    return hotel
}

export async function getHotelById(id:number){
    const hotel=await Hotel.findByPk(id)

    if(!hotel){
        logger.error(`Hotel not found : ${id}`)
        throw new NotFoundError("Hotel not found")
    }

    return hotel

}

export async function getAllHotels(){
    const hotels=await Hotel.findAll({
        where:{
            deletedAt:null
        }
    })

    if(!hotels){
        logger.error(`No hotels found`)
        throw new NotFoundError(`Cannot find hotels`)
    }
    logger.info(`hotels.found: ${hotels.length}`)
    return hotels
}


export async function softDeleteHotel(id:number){
    const hotel=await Hotel.findByPk(id)

    if(!hotel){
        logger.error(`No hotel found by Id: ${id}`)
        throw new NotFoundError("Could not find the hotel")
    }

    hotel.deletedAt=new Date()
    hotel.save()
    logger.info(`Hotel with ${id} soft deleted`)
    return true
}