import Redis from "ioredis";
import { serverConfig } from ".";



function connectToRedis(){
    let connection:Redis;
    const redisConfig={
    port:serverConfig.REDIS_PORT,
    host:serverConfig.REDIS_HOST,
    maxRetriesPerRequest:null,
    
}


    return ()=>{
        if(!connection){
            connection=new Redis(redisConfig)
        }
        return connection
    }
}


export const getRedisConnObject=connectToRedis()
