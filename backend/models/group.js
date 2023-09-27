// group.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
import User from './user.js';

const Group = sequelize.define('Group', {
    group_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    group_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'groups', // Specify the correct lowercase table name
});




  
  // Define a custom method to set the admin
  Group.prototype.setAdmin = async function (adminUser) {
    this.admin = adminUser;
    await this.save();
  };
  



export default Group