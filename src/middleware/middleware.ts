import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { Repository } from "../module/authentication/repository";
import { config, prisma } from "../utils/utils";

export interface CustomRequest extends Request {
    user: {
        id: string,
        email: string
    }
}

export class Middleware {

    static async verifySignUp(req: Request, res: Response, next: NextFunction) {
        try {
            const doesExist = await Repository.findUser(req.body.email)
            if (doesExist) return res.status(400).json({ status: "error", message: "Email is already in use!" })
            next()
        } catch (err) {
            next(err)
        }
    }

    // Token Middleware
    static catchError(err: Error, res: Response, next: NextFunction) {
        try {
            if (err instanceof TokenExpiredError) return res.status(401).json({ status: "error", message: "Unauthorized! token has expired" })
            return res.status(401).json({ status: "error", message: "Unauthorized!" })
        } catch (err) {
            next(err)
        }
    }

    static verifyJwt(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const token = req.headers.authorization ?? ""
            jwt.verify(token, config().secret, (err, decoded) => {
                if (err) this.catchError(err, res, next)
                if(decoded) req.user = decoded as { id: string, email: string }
            }
            )
            next()
        } catch (err) {
            next(err)
        }
    }


    // Role Based access controll
    static checkUserRole = (allowedRole: string[]) => {
        return async (req: CustomRequest, res: Response, next: NextFunction) => {
            try {
                const user = await prisma().user.findUnique({ where: { id: req.user?.id } })
                if (!user) return res.status(404).json({ status: "error", message: "User not found!" })
                const userRole = user.role || []
                const hasPermission = allowedRole.some((role) => userRole.includes(role))
                if (hasPermission) next()
                return res.status(403).json({ status: "error", message: "Unauthorized!" })
            } catch (err) {
                next(err)
            }


        }
    }

}