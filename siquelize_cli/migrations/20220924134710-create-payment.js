'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId'
        }
      },
      cardType: {
        type: Sequelize.STRING
      },
      customerId: {
        type: Sequelize.STRING
      },
      expiration: {
        type: Sequelize.STRING
      },
      nameOnCard: {
        type: Sequelize.STRING
      },
      number: {
        type: Sequelize.STRING
      },
      prefer: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      subscriberId: {
        type: Sequelize.STRING
      },
      paidAt: {
        type: Sequelize.DATE
      },
      agree: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.sequelize.query('ALTER SEQUENCE "Payments_id_seq" RESTART 10000');
    await queryInterface.addIndex('Payments', ['id']);
    await queryInterface.addIndex('Payments', ['userId']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Payments');
  }
};