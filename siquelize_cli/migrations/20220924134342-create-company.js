'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      isSubscribe: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isTrial: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      hasTrial: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      logo: {
        type: Sequelize.JSON
      },
      name: {
        type: Sequelize.STRING
      },
      trialAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex('Companies', ['id']);
    await queryInterface.sequelize.query('ALTER SEQUENCE "Companies_id_seq" RESTART 10000');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Companies');
  }
};
