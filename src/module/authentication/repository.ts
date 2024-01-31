import { Utils } from '../../utils/utils'
import { Token } from '../../utils/utils'
import bcrypt from 'bcryptjs'
import { SignIn, SignUp } from './Interface'



export class Repository extends Utils {

    public static async create(data: SignUp) {
        try {
            data.password = await bcrypt.hash(data.password, 20)
            return await this.prisma().user.create({
                data: {
                    fullname: data.fullName,
                    email: data.email,
                    role: data.role,
                    password: data.password
                }
            })

        } catch (err) {
            console.error(err)
            throw err
        }
    }

    public static async findUser(data: SignIn) {
        try {
            return await this.prisma().user.findUnique({
                where: {
                    email: data.email
                }
            })
        } catch (err) {
            throw err
        }
    }

    
    public static async user(userId: string){
        try{
            return await this.prisma().user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    fullname: true,
                    email: true,
                    role: true,
                    password: true
                }
                
            })

        }catch(err){
            throw err
        }
    }

    public static async updateRefreshToken(data: Token){
        try{
            return await this.prisma().user.update({
                where: {
                    id: data.id
                },
                data: {
                    refreshtoken: ""
                }
            })

        }catch(err){
            throw err
        }
    }
}