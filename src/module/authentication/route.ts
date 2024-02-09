import express from 'express'
import { Auth } from './controller'
import { Middleware } from '../../middleware/middleware'
const auth = express.Router()

auth.post('/signup', Middleware.verifySignUp, Auth.signUp)
auth.post('/login', Auth.login)
auth.post('/google-signup')
auth.post('/google-login')
auth.post('/logout')

export default auth