import express from 'express'
import { createGroupChatMessage, retrieveMessages } from '../controllers/chat.js'

const router = express.Router()
router.post('/',createGroupChatMessage )
router.get('/display',retrieveMessages)


export default router