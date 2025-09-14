import {registerAs} from "@nestjs/config"

export default registerAs('redis',()=>({
    host:process.env.REDIS_HOST || 'localhost',
    port:6379,
    password:"",
    db:parseInt(process.env.REDIS_DB ?? "0", 10),
}))