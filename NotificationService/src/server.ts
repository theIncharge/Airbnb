import express from "express"
import { serverConfig } from "./config"
import v1Router from "./routers/v1/index.router"
import v2Router from "./routers/v2/index.router"
import { genericErrrorHandler } from "./middlewares/error.middleware"
import logger from "./config/logger.config"
import { attachCorrelationMiddleware } from "./middlewares/correlation.middleware"
import { setupMailerWorker } from "./processor/email.processor"
import { addEmailToQueue } from "./producer/email.producer"


const app=express()
app.use(attachCorrelationMiddleware)

app.use(express.json())


app.use('/api/v1',v1Router)
app.use('/api/v2',v2Router)

app.use(genericErrrorHandler)

app.listen(serverConfig.PORT,async ()=>{
    console.log("app is listening on port: ",serverConfig.PORT)
    logger.info(`Press Ctrl+c to stop the server`,{"name":"hello"})
    setupMailerWorker()
    logger.info(`mailer worker is ready`)

   addEmailToQueue({
    to:"adityagaur1741@gmail.com",
    subject:"Test Mail",
    templateId:"welcome",
    params:{
        name:"Aditya Gaur" ,
        appName:"Airbnb"
    }
   })
    
})