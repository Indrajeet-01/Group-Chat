import { Sequelize } from 'sequelize';


export const sequelize = new Sequelize('groupchatdb', 'root', 'isy987', {
  host: 'localhost',
  dialect: 'mysql', 
  pool: {
    max: 5,
    min: 0,
  },
  logging: console.log,
});

sequelize.sync()
    .then(() => {
        console.log('Models synchronized with the database');
    })
    .catch((error) => {
        console.error('Error synchronizing models:', error);
});
