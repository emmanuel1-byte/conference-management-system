import express from 'express'
import { Auth } from './controller'
import { verifySignUp } from '../../middleware/verifySignUp'
const auth = express.Router()

auth.post('/signup', verifySignUp, Auth.signUp)
auth.post('/login', Auth.login)

export default auth