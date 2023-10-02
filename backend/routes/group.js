import express from 'express'
import { createGroupAndAddUsers, getAllGroupMembers, getAllGroups, getAllUsers, removeUsersByAdmin } from '../controllers/group.js'


const router = express.Router()

router.post('/',createGroupAndAddUsers )
router.get('/users',getAllUsers)
router.get('/display/:id',getAllGroups)
router.get('/:groupId/members',getAllGroupMembers)
router.delete('/removeMembers/:groupId/:adminID', removeUsersByAdmin)



export default router
