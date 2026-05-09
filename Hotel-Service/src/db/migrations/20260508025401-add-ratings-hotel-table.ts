'use strict';

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface:QueryInterface) {
     await queryInterface.sequelize.query(`
        ALTER TABLE hotels
        ADD COLUMN rating DECIMAL(3,2) DEFAULT NULL,
        ADD COLUMN rating_count INT DEFAULT NULL
        `)
  },

  async down (queryInterface:QueryInterface) {
   await queryInterface.sequelize.query(`
    ALTER TABLE hotels
    DROP COLUMNS rating,
    DROP COLUMNS rating_count
    `)
  }
};
