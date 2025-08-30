module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define('Enrollment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    progress: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00
    },
    startDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    completionDate: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM('enrolled', 'active', 'completed', 'dropped'),
      defaultValue: 'enrolled'
    }
  }, {
    timestamps: true,
    tableName: 'enrollments'
  });

  return Enrollment;
};