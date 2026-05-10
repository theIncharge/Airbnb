import express from "express"
import { validateRequestBody } from "../../validators"
import { creatingBookingScheme } from "../../validators/booking.validator"
import { boookingHandler, confirmBooking } from "../../controllers/booking.controller"
const bookingRouter=express()

bookingRouter.post('/confirm/:idempotencyKey',confirmBooking)
bookingRouter.post('/',validateRequestBody(creatingBookingScheme),boookingHandler)

export default bookingRouter