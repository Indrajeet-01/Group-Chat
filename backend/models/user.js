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
  tableName: 'users', 
});


// Define associations
Group.belongsTo(User, {
    foreignKey: 'admin_id',
    as: 'admin',
    onDelete: 'CASCADE',
  });

  Group.belongsToMany(User, {
    through: 'user_group', 
    foreignKey: 'group_id',
    as: 'group_members',
  });
  
  


  Group.prototype.addUser = async function (user) {
    await this.addGroup_members(user);
  };
  Group.prototype.removeUser = async function (user) {
    await this.removeGroup_members(user);
  };

export default User; 
