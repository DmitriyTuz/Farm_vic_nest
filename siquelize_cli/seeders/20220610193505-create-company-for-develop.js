'use strict';
// const {Company} = require('../src/companies/companies.model.ts');
// import {Company} from "../companies/companies.model";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Companies', [{
            // logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg',
            logo: "111",
            name: 'Company One',
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Companies', null, {});
    }
};


// module.exports = {
//     up: (queryInterface, Sequelize) => {
//         return queryInterface.create('Companies', [{
//             logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg',
//             name: 'Company One'
//         }]);
//     },
//
//     down: (queryInterface, Sequelize) => {
//
//     }
// };



// module.exports = {
//     async up() {
//         try {
//             await Company.create({logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg', name: 'Company One'});
//             // await Company.create({logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg', name: 'Company Two'});
//             // await Company.create({logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg', name: 'Company Three'});
//         } catch (e) {
//         }
//     },
//
//     async down(queryInterface, Sequelize) {
//         /**
//          * Add commands to revert seed here.
//          *
//          * Example:
//          * await queryInterface.bulkDelete('People', null, {});
//          */
//     }
// };
