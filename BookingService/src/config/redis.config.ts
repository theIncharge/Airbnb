import IORedis from 'ioredis'
import Redlock from 'redlock'
import { serverConfig } from '.'

const redisClient=new IORedis(serverConfig.REDIS_SERVER_URL)





function connectToRedis(){
    let connection:IORedis;
   


    return ()=>{
        if(!connection){
            connection=new IORedis(serverConfig.REDIS_SERVER_URL)
        }
        return connection
    }
}


export const getRedisConnObject=connectToRedis()





const redlock= new Redlock([getRedisConnObject() as any],{
    retryCount:10,
    retryDelay:200,
    retryJitter:200,
    driftFactor: 0.01
})

export {redisClient,redlock}