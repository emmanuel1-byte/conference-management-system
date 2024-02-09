import EventEmitter from "events";
import { v4 as uuidv4 } from 'uuid'
import { Service } from "../../service/service";
import { Repository } from "../../module/authentication/repository";
import { SignUpData } from "./interface";
const auth = new EventEmitter()


auth.on('signUp', async(data: SignUpData)=>{
    try{
        const token = uuidv4()
        const tokenData = {
            type:  'Verification_Email',
            token: token,
            email: data.email,
            expireIn: new Date()
        }
        await Repository.createToken(tokenData)
        const emailContent = {
          to: data.email,
          subject: 'Welcome to conference management system ',
          html: `<h3>Please click <a href="${'http://localhost:${token}'}">here</a> to verify your email</h3>`
        }
        Service.email(emailContent)

    }catch(err){
        throw err
    }

})

export default auth