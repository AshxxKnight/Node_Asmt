const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with your database configuration
const sequelize1 = new Sequelize({
  dialect: 'mysql', // Change to your preferred database dialect
  host: 'localhost',
  username: 'root',
  password: 'root',
  database: 'node_app_data',
});

// Define your Sequelize models
const teachers = sequelize1.define('teachers', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
    // timestamps:false,
  
  });



// Define any associations here (e.g., User.hasMany(AnotherModel))

// Synchronize the models with the database (create the tables)
sequelize1.sync()
  .then(() => {
    console.log('Database tables created');
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });

module.exports = {
  sequelize1, // Export the Sequelize instance for use in other parts of your app
  teachers, // Export the  model

};