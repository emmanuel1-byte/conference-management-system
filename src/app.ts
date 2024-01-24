import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.get('/', (req: Request, res: Response)=>{
    res.status(200).json({ message: 'confrence-management-api is running...'})
})

app.get('*', (req: Request, res: Response)=>{
    res.status(400).json({ message: "Endpoint does not exist"})
})

export default app