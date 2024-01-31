import { Request, Response, NextFunction } from "express";
import { SignUpSchema, loginSchema } from "./schema";
import { Repository } from "./repository";
import { Utils } from "../../utils/utils";
import bcrypt from 'bcryptjs'

export class Auth extends Utils {
    public static async signUp(req: Request, res: Response, next: NextFunction){
        try {
            const validationResult = SignUpSchema.parse(req.body)
            const data = await Repository.create(validationResult)
            if (!data) return res.status(500).json({ message: "Not created" })
            return res.status(201).json({ message: "Registration successfull", data })
        } catch (err) {
            this.validationError(err, res, next)
        }
    }

    public static async login(req: Request, res: Response, next: NextFunction){
        const self = Auth
        try {
            const validationResult = loginSchema.parse(req.body)
            //Check if User Exist
            const user = await Repository.findUser(validationResult)
            // Compare passwords
            const isPasswordCorrect = user && await bcrypt.compare(validationResult.password, user.password)
            //Do not reveal whether the username or password is incorrect for security reasons
            if (!isPasswordCorrect) return res.status(400).json({ status: "error", message: "Invalid credentials" })
            // Fetch user details
            const currentUser = await Repository.user(user.id)
            // Generate tokens
            const { accessToken, refreshToken } = await self.generateTokens(user)
            // set cookies
            self.setRefreshTokenCookie(res, refreshToken)
            return res.status(200).json({ status: "Ok", message: "Login successfull", user: currentUser, access_token: accessToken })
        } catch (err) {
            console.error(err)
            self.validationError(err, res, next)
        }

    }

    public static async googleSignUp(req: Request, res: Response) {

    }

    public static async googleLogin(req: Request, res: Response) {

    }
}