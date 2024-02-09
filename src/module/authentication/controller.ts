import { Request, Response, NextFunction } from "express";
import { SignUpSchema, loginSchema } from "./schema";
import { Repository } from "./repository";
import bcrypt from 'bcryptjs'
import { CustomRequest } from "../../middleware/middleware";
import auth from "../../events/auth/emitter";
import { generateTokens, setRefreshTokenCookie, validationError } from "../../utils/utils";

export class Auth {
    public static async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const validationResult = SignUpSchema.parse(req.body)
            const data = await Repository.create(validationResult)
            if (!data) return res.status(500).json({ status: "error", message: "Not created" })
            auth.emit('signUp', validationResult)
            return res.status(201).json({ message: "Registration successfull", data })
        } catch (err) {
            validationError(err, res, next)
        }
    }

    public static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const validationResult = loginSchema.parse(req.body)
            const user = await Repository.findUser(validationResult.email)
            const isPasswordCorrect = user && await bcrypt.compare(validationResult.password, user.password)
            if (!isPasswordCorrect) return res.status(400).json({ status: "error", message: "Invalid credentials" })
            const currentUser = await Repository.user(user.id)
            const { accessToken, refreshToken } = await generateTokens(user)
            setRefreshTokenCookie(res, refreshToken)
            return res.status(200).json({ status: "Ok", message: "Login successfull", user: currentUser, access_token: accessToken })
        } catch (err) {
            validationError(err, res, next)
        }

    }

    public static async googleSignUp(req: Request, res: Response, next: NextFunction) {
        try {


        } catch (err) {
            validationError(err, res, next)
        }

    }

    public static async googleLogin(req: Request, res: Response) {

    }

    public static async refreshAccessToken(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { accessToken, refreshToken } = await generateTokens(req.user)
            setRefreshTokenCookie(res, refreshToken)
            return res.status(200).json({ status: "Ok", message: "Access token refreshed!", data: accessToken })
        } catch (err) {
            next(err)
        }
    }

    public static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const accessToken = req.headers?.authorization ?? "[]"
            const refreshToken = req.cookies?.refreshToken
            await Repository.createBlacklist(accessToken)
            res.clearCookie(refreshToken)
            return res.status(204).json({})
        } catch (err) {
            next(err)
        }
    }

}