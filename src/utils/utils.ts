import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client";
import { NextFunction, Response } from "express"
import { ZodError } from "zod"

export interface Token {
    id: string
    email?: string
}

export class Utils {

    static generateAccesToken(data: Token) {
        try {
            const payload: object = { sub: data.id, email: data.email }
            return jwt.sign(payload, this.config().secret, { algorithm: 'HS256', expiresIn: '1h' })
        } catch (err) {
            throw err
        }
    }

    static async generateRefreshToken(data: Token) {
        try {
            const payload = { sub: data.id }
            const refreshToken = jwt.sign(payload, this.config().secret, { algorithm: 'HS256', expiresIn: '1d' })
            await this.prisma().user.update({ where: { id: payload.sub }, data: { refreshtoken: refreshToken } })
            return refreshToken
        } catch (err) {
            throw err
        }
    }

    static async generateTokens(user: Token) {
        try {
            const accessToken = this.generateAccesToken(user)
            const refreshToken = await this.generateRefreshToken(user)
            return { accessToken, refreshToken }
        } catch (err) {
            throw err
        }
    }

    static setRefreshTokenCookie(res: Response, refreshToken: string) {
        try {
            res.clearCookie('refreshToken')
            res.cookie('refreshToken', refreshToken, { maxAge: 2 * 24 * 60 * 60 * 1000, secure: true, httpOnly: true })
        } catch (err) {
            throw err
        }
    }

    static prisma() {
        try {
            return new PrismaClient()
        } catch (err) {
            throw err
        }
    }

    static validationError(err: any, res: Response, next: NextFunction) {
        try {
            if (err instanceof ZodError) {
                return res.status(400).json({ status: "error", message: "Invalid input data", errors: err.errors })
            }
            next(err)
        } catch (err) {
            throw err
        }
    }

    static config() {
        try {
            return {
                dbUrl: process.env.DATABASE_URL,
                secret: process.env.JWT_SECRET as string,
            }
        } catch (err) {
            throw err
        }
    }
}