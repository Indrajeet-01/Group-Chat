import GroupChat from '../models/chat.js';// Assuming the path to your GroupChat model is correct
import User from '../models/user.js'; // Assuming the path to your User model is correct
import Group from '../models/group.js';// Assuming the path to your User model is correct
// Assuming the path to your userGroup model is correct


// Controller function to create a new group chat message
export const createGroupChatMessage = async (req, res) => {
    try {
      const { groupId, senderId, message, filename, filepath } = req.body;
  
      // Check if the group exists
      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
  
      // Check if the sender is a member of the group
      const user = await User.findByPk(senderId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the user is a member of the group based on the association
      const isMember = await group.hasGroup_members(user);
      if (!isMember) {
        return res.status(403).json({ error: 'User is not a member of the group' });
      }
  
      // Create a new group chat message
      const newMessage = await GroupChat.create({
        
        group_id: groupId,
        senderId,
        message,
        filename,
        filepath,
      });
  
      // Return the newly created message as a response
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error creating group chat message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };



// Controller function to retrieve existing chat messages for a specific group and its members
export const retrieveMessages = async (req, res) => {
    try {
        const { groupId, userId } = req.query;

        // Check if the user is a member of the group
        const isMember = await Group.findOne({
            where: {
                id: groupId, 
            },
            include: [
                {
                    model: User,
                    as: 'group_members',
                    where: {
                        id: userId,
                    },
                },
            ],
        });

        if (!isMember) {
            return res.status(403).json({ error: 'User is not a member of the group' });
        }

        // Fetch messages for the specified group
        const messages = await GroupChat.findAll({
            where: {
                groupId,
            },
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['username'],
                },
            ],
            order: [['createdAt', 'ASC']],
        });

        // Respond with the retrieved messages
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};