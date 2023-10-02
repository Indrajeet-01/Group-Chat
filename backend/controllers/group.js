
import User from '../models/user.js'; 
import Group from '../models/group.js'; 
import { sequelize } from '../db.js';


export const getAllUsers = async (req, res) => {
  try {
      const users = await User.findAll({
          attributes: ['id', 'name'], 
      });
      res.status(200).json(users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
  }
};


//  controller function for creating a group and adding users
export const createGroupAndAddUsers = async (req, res) => {
  const { adminId, groupName, usersToAdd } = req.body;

  try {
    // Verify that the admin user exists
    const adminUser = await User.findByPk(adminId);

    if (!adminUser) {
      return res.status(400).json({ message: 'Admin user not found.' });
    }

    // Create the group with the provided admin ID
    const group = await Group.create({
      group_name: groupName,
      admin_id: adminId,
    });

    // Associate the admin user with the group
    await group.setAdmin(adminUser);

    // Add the admin user to the group as a member
    await group.addUser(adminUser);

    // Add other users to the group
    for (const userId of usersToAdd) {
      const user = await User.findByPk(userId);
      if (user) {
        await group.addUser(user); // Add the user to the group
      } else {
        console.warn(`User with ID ${userId} not found and won't be added to the group.`);
      }
    }

    return res.status(201).json({ message: 'Group created and users added successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// controller function to display the groups
export const getAllGroups = async (req, res) => {
  try {
    
    const loggedInUserId = req.params.id 

    const userGroupIds = await sequelize.query(`
      SELECT group_id FROM user_group WHERE UserId = :UserId
    `, {
      replacements: { UserId: loggedInUserId },
      type: sequelize.QueryTypes.SELECT,
    });

    const groupIds = userGroupIds.map((userGroup) => userGroup.group_id);

    // Retrieve the groups based on the extracted group IDs
    const groups = await Group.findAll({
      where: {
        group_id: groupIds,
      },
      attributes: ['group_id', 'group_name', 'admin_id'],
    });

    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Controller function to get all members of a specific group
export const getAllGroupMembers = async (req, res) => {
  const { groupId } = req.params;

  try {
    // Find the group by its ID
    const group = await Group.findByPk(groupId, {
      include: [{
        model: User, // Include the User model to fetch group members
        as: 'group_members', // Define an alias for the association
        attributes: ['id', 'name', 'email'], // Specify the attributes to include
      }],
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    // Extract the members from the group
    const groupMembers = group.group_members;

    return res.status(200).json({ members: groupMembers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// controller function for removing users from a group by admin
export const removeUsersByAdmin = async (req, res) => {
  const {adminID, groupId} = req.params
  const {  usersToRemove } = req.body;

  const adminId = parseInt(adminID)

  try {
    // Verify that the admin user exists
    const adminUser = await User.findByPk(adminId);

    if (!adminUser) {
      return res.status(400).json({ message: 'Admin user not found.' });
    }

    // Verify that the group exists and the admin has the necessary permissions
    const group = await Group.findByPk(groupId);

    if (!group) {
      return res.status(400).json({ message: 'Group not found.' });
    }

    console.log("output",typeof(adminId),typeof(group.admin_id))

    if (group.admin_id !== adminId) {
      return res.status(403).json({ message: 'Admin does not have permission to remove users from this group.' });
    }

    // Remove users from the group
    for (const userId of usersToRemove) {
      const user = await User.findByPk(userId);
      if (user) {
        await group.removeUser(user); // Remove the user from the group
      } else {
        console.warn(`User with ID ${userId} not found and won't be removed from the group.`);
      }
    }

    return res.status(200).json({ message: 'Users removed successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
