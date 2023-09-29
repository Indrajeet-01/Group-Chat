// Import necessary modules and Sequelize
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js'; // Assuming the path to your Sequelize instance is correct
import User from './user.js'; // Assuming the path to your User model is correct
import Group from './group.js'; // Assuming the path to your Group model is correct

const GroupChat = sequelize.define('GroupChat', {
    chat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    message: {
        type: DataTypes.TEXT, // Text content of the message
        allowNull: false,
    },
    filename: {
        type: DataTypes.STRING, // Store the filename of the multimedia file (if applicable)
    },
    filepath: {
        type: DataTypes.STRING, // Store the path to the multimedia file on your server (if applicable)
    },
    
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

// Define associations with User and Group models
GroupChat.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

GroupChat.belongsTo(Group, {
    foreignKey: 'group_id',
    onDelete: 'CASCADE',
});

// Export the GroupChat model
export default GroupChat;
