// Assuming the path to your Sequelize instance is correct
import User from '../models/user.js'; // Assuming the path to your User model is correct
import Group from '../models/group.js'; // Assuming the path to your Group model is correct

// display all the users
// Assuming you have a User model

export const getAllUsers = async (req, res) => {
  try {
      const users = await User.findAll({
          attributes: ['id', 'name'], // Select only the relevant attributes
      });
      res.status(200).json(users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
  }
};


// Define the controller function for creating a group and adding users
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
