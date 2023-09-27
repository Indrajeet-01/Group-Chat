import { DataTypes} from 'sequelize'

import {sequelize} from '../db.js'
import Group from './group.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        autoIncrement: true, 
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phonenumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
  tableName: 'users', // Specify the correct lowercase table name
});
// Assuming this code is added to your Sequelize models

// Define associations
Group.belongsTo(User, {
    foreignKey: 'admin_id',
    as: 'admin',
    onDelete: 'CASCADE',
  });

  Group.belongsToMany(User, {
    through: 'user_group', // Use your actual join table name
    foreignKey: 'group_id',
    as: 'group_members',
  });
  
  


  Group.prototype.addUser = async function (user) {
    await this.addGroup_members(user);
  };
  

export default User; 
