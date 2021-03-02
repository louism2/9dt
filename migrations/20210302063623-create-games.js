'use strict';

const { uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      await queryInterface.createTable("games", { 
          id: {
              type: Sequelize.UUID,
              primaryKey: true,
              defaultValue: Sequelize.literal('uuid_generate_v4()')
          },
          columns: {
              type: Sequelize.INTEGER,
              allowNull: false,
          },
          rows: {
              type: Sequelize.INTEGER,
              allowNull: false,
          },
          players: {
              type: Sequelize.ARRAY(Sequelize.STRING),
              allowNull: false
          },
          state: {
              type: Sequelize.STRING,
              allowNull: false,
              defaultValue: "IN_PROGRESS"
          },
          winner: Sequelize.STRING,
          createdAt: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal('NOW()')
          }
      });

  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("games");
  }
};
