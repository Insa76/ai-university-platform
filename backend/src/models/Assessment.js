module.exports = (sequelize, DataTypes) => {
  const Assessment = sequelize.define('Assessment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('quiz', 'assignment', 'exam', 'project'),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    questions: {
      type: DataTypes.JSON
    },
    maxScore: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 100.00
    },
    passingScore: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 70.00
    },
    timeLimit: {
      type: DataTypes.INTEGER // in minutes
    },
    attemptsAllowed: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    timestamps: true,
    tableName: 'assessments'
  });

  return Assessment;
};