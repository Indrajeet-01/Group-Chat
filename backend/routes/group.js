import express from 'express'
import { createGroupAndAddUsers, getAllGroups, getAllUsers } from '../controllers/group.js'


const router = express.Router()

router.post('/',createGroupAndAddUsers )
router.get('/users',getAllUsers)
router.get('/display',getAllGroups)



export default router
