'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("moves", {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.literal('uuid_generate_v4()')
            },
            gameId: {
                type: Sequelize.UUID,
                references: {
                    model: "games",
                    key: "id"
                },
                allowNull: false
            },
            column: {
                type: Sequelize.INTEGER,
            },
            type: {
                type: Sequelize.STRING
            },
            player: {
                type: Sequelize.STRING
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('NOW()')
            }
        }).then(() => {
            queryInterface.addIndex("moves", ["gameId"]);
        })
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("moves");
    }
};
