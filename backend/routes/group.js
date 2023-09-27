import express from 'express'
import { createGroupAndAddUsers, getAllUsers } from '../controllers/group.js'


const router = express.Router()

router.post('/',createGroupAndAddUsers )
router.get('/users',getAllUsers)



export default router
