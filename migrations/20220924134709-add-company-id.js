'use strict';


module.exports = {
    async up(queryInterface, Sequelize) {
        const attribute = {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            references: {
                model: 'Companies',
                key: 'id',
                as: 'companyId'
            }
        };

        // module.exports = {
        //     up: async (queryInterface, Sequelize) => {
        //         await queryInterface.addColumn('table_name', 'foreign_key_column', {
        //             type: Sequelize.INTEGER,
        //             references: {
        //                 model: 'related_table_name',
        //                 key: 'id',
        //             },
        //             onUpdate: 'CASCADE',
        //             onDelete: 'CASCADE',
        //         });
        //     },
        //
        //     down: async (queryInterface, Sequelize) => {
        //         await queryInterface.removeColumn('table_name', 'foreign_key_column');
        //     },
        // };


        await queryInterface.addColumn('Users', 'companyId', attribute );
        // await queryInterface.addColumn('Tasks', 'companyId', attribute);
        await queryInterface.addColumn('Tags', 'companyId', attribute);
        // await queryInterface.addColumn('MapLocations', 'companyId', attribute);

        // await queryInterface.addIndex('Users', ['companyId']);
        // await queryInterface.addIndex('Tasks', ['companyId']);
        // await queryInterface.addIndex('Tags', ['companyId']);
        // await queryInterface.addIndex('MapLocations', ['companyId']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Users', 'companyId');
        await queryInterface.removeColumn('Tags', 'companyId');
    },
};

//     async down(queryInterface, Sequelize) {
//         /**
//          * Add reverting commands here.
//          *
//          * Example:
//          * await queryInterface.dropTable('users');
//          */
//     }
// };
