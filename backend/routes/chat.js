import express from 'express'
import { createGroupChatMessage } from '../controllers/chat.js'

const router = express.Router()
router.post('/',createGroupChatMessage )


export default router