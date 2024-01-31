import express, { Request, Response, NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import auth from './module/authentication/route'

var app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/v1', auth)

app.get('/', (req: Request, res: Response)=>{
    res.status(200).json({ message: 'confrence-management-api is running...'})
})

app.get('*', (req: Request, res: Response)=>{
    res.status(400).json({ message: "Endpoint does not exist"})
})

app.use((err: Error, req:  Request, res: Response, next: NextFunction )=>{
    const errorMessage =  err.message || "Internal Server Error"
    res.status(500).json({ status: 'error', message: errorMessage })
})


export default app