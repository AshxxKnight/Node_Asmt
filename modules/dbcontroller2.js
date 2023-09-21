const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with your database configuration
const sequelize2 = new Sequelize({
  dialect: 'mysql', // Change to your preferred database dialect
  host: 'localhost',
  username: 'root',
  password: 'root',
  database: 'node_app_data',
});

// Define your Sequelize models
const students = sequelize2.define('students', {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rno: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey:true,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  score:{
    type: DataTypes.FLOAT,
    allowNull:true,
  },
});

// Define any associations here (e.g., User.hasMany(AnotherModel))

// Synchronize the models with the database (create the tables)
sequelize2.sync()
  .then(() => {
    console.log('Database tables created');
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });

  students.sync();

module.exports = {
  sequelize2, // Export the Sequelize instance for use in other parts of your app
  students, // Export the User model
  // Add other models and functions as needed
};