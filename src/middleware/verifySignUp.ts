import { NextFunction, Request, Response } from "express";
import { Repository } from "../module/authentication/repository";

export async function verifySignUp(req: Request, res: Response, next: NextFunction) {
    try {
        const doesExist = await Repository.findUser(req.body)
        if (doesExist) return res.status(400).json({ status: "error", message: "Email is already in use!" })
        next()
    } catch (err) {
        next(err)
    }
}