module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define('Lesson', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER, // in minutes
      defaultValue: 0
    },
    videoUrl: {
      type: DataTypes.STRING
    },
    resources: {
      type: DataTypes.JSON
    }
  }, {
    timestamps: true,
    tableName: 'lessons'
  });

  return Lesson;
};