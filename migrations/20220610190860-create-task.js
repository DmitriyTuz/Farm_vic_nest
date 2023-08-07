'use strict';
const {TaskStatuses} = require("../src/lib/constants1");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      title: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      executionTime: {
        type: Sequelize.DECIMAL,
      },
      comment: {
        type: Sequelize.STRING
      },
      mediaInfo: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        defaultValue: []
      },
      documentsInfo: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        defaultValue: []
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: TaskStatuses.ACTIVE
      },
      completedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
    await queryInterface.addIndex('Tasks', ['id']);
    await queryInterface.sequelize.query('ALTER SEQUENCE "Tasks_id_seq" RESTART 10000');
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Tasks');
  }
};
