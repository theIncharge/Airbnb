import express from 'express';
import { getAvailableRoomsHandler, updateBookingIdToRoomsHandler } from '../../controllers/room.controller';
import { validateQueryParams, validateRequestBody } from '../../validators';
import { getAvailableRoomSchema, updateBookingIdToRoomSchema } from '../../validators/room.validator';
const roomRouter = express.Router();

roomRouter.get('/available',validateQueryParams(getAvailableRoomSchema) ,getAvailableRoomsHandler); // TODO: Resolve this TS compilation issue
roomRouter.post('/update-booking-id',validateRequestBody(updateBookingIdToRoomSchema) ,updateBookingIdToRoomsHandler); // TODO: Resolve this TS compilation issue


export default roomRouter;