import GroupChat from '../models/chat.js';
import User from '../models/user.js';
import Group from '../models/group.js';


// Controller function to create a new group chat message
export const createGroupChatMessage = async (req, res) => {
    try {
        const { groupId, senderId } = req.params; // Get groupId and senderId from URL params
        const { message, filename, filepath } = req.body;
  
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
        user_id: senderId,
        message,
        filename,
        filepath, 
      });
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error creating group chat message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };



// Controller function to retrieve all chat messages for a specific group
export const retrieveMessages = async (req, res) => {
  try {
      const { groupId } = req.query;

      // Fetch messages for the specified group
      const messages = await GroupChat.findAll({
          where: {
              group_id:groupId,
          },
          
          order: [['createdAt', 'ASC']],
      });

      res.status(200).json(messages);
  } catch (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};
