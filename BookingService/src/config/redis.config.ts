import IORedis from 'ioredis'
import Redlock from 'redlock'
import { serverConfig } from '.'

const redisClient=new IORedis(serverConfig.REDIS_SERVER_URL)

const redlock= new Redlock([redisClient as any],{
    retryCount:10,
    retryDelay:200,
    retryJitter:200,
    driftFactor: 0.01
})

export {redisClient,redlock}