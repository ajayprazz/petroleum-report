module.exports = (sequelize, Sequelize) => {
  const Petroleums = sequelize.define(
    "petroleums",
    {
      year: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      petroleum_product: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      sale: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  return Petroleums;
};
