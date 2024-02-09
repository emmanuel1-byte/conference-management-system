import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { prisma } from '../../utils/utils'

export class Repository {

    public static async create(data: Prisma.UserCreateInput) {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10)
            return await prisma().user.create({
                data: {
                  ...data,
                  password: hashedPassword
                }
            })

        } catch (err) {
            console.error(err)
            throw err
        }
    }

    public static async findUser(email: string) {
        try {
            return await prisma().user.findUnique({
                where: {
                    email: email
                }
            })
        } catch (err) {
            throw err
        }
    }


    public static async user(userId: string) {
        try {
            return await prisma().user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    fullname: true,
                    email: true,
                    role: true,
                    password: true,
                    refreshtoken: false
                }

            })

        } catch (err) {
            throw err
        }
    }

    public static async updateRefreshToken(userId: string) {
        try {
            return await prisma().user.update({
                where: {
                    id: userId
                },
                data: {
                    refreshtoken: ""
                }
            })

        } catch (err) {
            throw err
        }
    }

    public static async createToken(data: Prisma.TokenCreateInput){
        try{
            return await prisma().token.create({
                data: { ...data },
            })

        }catch(err){
            throw err
        }
    }

    public static async createBlacklist(token: string) {
        try {
            return await prisma().blacklist.create({ data: { token: token } })
        } catch (err) {
            throw err
        }
    }
}