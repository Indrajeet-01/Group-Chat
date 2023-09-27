import express from 'express'
import {register,login, logout} from '../controllers/user.js'
import { authMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/register',register)
router.post('/login', login)
router.post('/logout', logout)




export default router