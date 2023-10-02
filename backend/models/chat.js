
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js'; 
import User from './user.js'; 
import Group from './group.js'; 

const GroupChat = sequelize.define('GroupChat', {
    chat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
    },
    message: {
        type: DataTypes.TEXT, 
        allowNull: false,
    },
    filename: {
        type: DataTypes.STRING, 
    },
    filepath: {
        type: DataTypes.STRING, 
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


export default GroupChat;
