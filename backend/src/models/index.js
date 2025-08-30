const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Database connection - DESACTIVAR SSL para desarrollo local
const sequelize = new Sequelize(
  process.env.DB_NAME || 'university',
  process.env.DB_USER || 'user_uni',
  process.env.DB_PASSWORD || 'insa2025',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: false
    },
    ssl: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import models
const User = require('./User')(sequelize, DataTypes);
const Course = require('./Course')(sequelize, DataTypes);
const Module = require('./Module')(sequelize, DataTypes);
const Lesson = require('./Lesson')(sequelize, DataTypes);
const Enrollment = require('./Enrollment')(sequelize, DataTypes);
const Assessment = require('./Assessment')(sequelize, DataTypes);

// Associations
User.hasMany(Enrollment);
Enrollment.belongsTo(User);

Course.hasMany(Module);
Module.belongsTo(Course);

Module.hasMany(Lesson);
Lesson.belongsTo(Module);

Course.hasMany(Enrollment);
Enrollment.belongsTo(Course);

User.hasMany(Assessment);
Assessment.belongsTo(User);

Course.hasMany(Assessment);
Assessment.belongsTo(Course);

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida correctamente');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✅ Tablas sincronizadas correctamente');
  })
  .catch(err => {
    console.error('❌ Error en la base de datos:', err.message);
    console.error('Detalles del error:', err);
  });

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Course,
  Module,
  Lesson,
  Enrollment,
  Assessment
};