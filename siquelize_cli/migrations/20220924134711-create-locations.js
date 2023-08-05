'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MapLocations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      lat: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      lng: {
        allowNull: false,
        type: Sequelize.DECIMAL
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
    await queryInterface.addIndex('MapLocations', ['id']);
    await queryInterface.sequelize.query('ALTER SEQUENCE "MapLocations_id_seq" RESTART 10000');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MapLocations');
  }
};
