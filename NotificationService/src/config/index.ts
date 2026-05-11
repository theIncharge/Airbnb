import dotenv from 'dotenv'

type ServerConfig= {
    PORT:number
    REDIS_PORT: number,
    REDIS_HOST:string
    MAIL_PASS:string,
    MAIL_USER:string
}

export function loadEnv(){
    dotenv.config()
    console.log(`Environment Variables are loaded`)
}

loadEnv()

export const serverConfig: ServerConfig={
    PORT:Number(process.env.PORT)||3001,
    REDIS_HOST:process.env.REDIS_HOST || 'localhost',
    REDIS_PORT:Number(process.env.REDIS_PORT) || 6379,
    MAIL_PASS:process.env.MAIL_PASS || "root",
    MAIL_USER:process.env.MAIL_USER ||"root"
}