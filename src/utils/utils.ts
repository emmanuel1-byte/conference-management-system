import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client";
import { NextFunction, Response } from "express"
import { ZodError } from "zod"

export interface Token {
    id: string
    email?: string
}


export const generateAccesToken = async (data: Token) => {
    try {
        const payload = { userId: data.id, email: data.email }
        return jwt.sign(payload, config().secret, { algorithm: 'HS256', expiresIn: '1h' })
    } catch (err) {
        throw err
    }
}

export const generateRefreshToken = async (data: Token) => {
    try {
        const payload = { userId: data.id }
        const refreshToken = jwt.sign(payload, config().secret, { algorithm: 'HS256', expiresIn: '1d' })
        await prisma().user.update({ where: { id: payload.userId }, data: { refreshtoken: refreshToken } })
        return refreshToken
    } catch (err) {
        throw err
    }
}

export const generateTokens = async (user: Token) => {
    try {
        const accessToken = generateAccesToken(user)
        const refreshToken = await generateRefreshToken(user)
        return { accessToken, refreshToken }
    } catch (err) {
        throw err
    }
}

export const setRefreshTokenCookie = async (res: Response, refreshToken: string) => {
    try {
        res.clearCookie('refreshToken')
        res.cookie('refreshToken', refreshToken, { maxAge: 2 * 24 * 60 * 60 * 1000, secure: true, httpOnly: true, sameSite: "lax" })
    } catch (err) {
        throw err
    }
}


export const prisma = () => {
    try {
        return new PrismaClient()
    } catch (err) {
        throw err
    }
}

export const validationError = (err: unknown, res: Response, next: NextFunction) => {
    try {
        if (err instanceof ZodError) {
            return res.status(400).json({ status: "error", message: "Invalid input data", errors: err.errors })
        }
        next(err)
    } catch (err) {
        throw err
    }
}

export const config = () => {
    try {
        return {
            dbUrl: process.env.DATABASE_URL,
            secret: process.env.JWT_SECRET as string,
            googelUser: process.env.USER_NAME,
            googlePass: process.env.APP_PASSWORD
        }
    } catch (err) {
        throw err
    }
}