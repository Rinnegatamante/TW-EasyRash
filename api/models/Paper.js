/**
 * Paper.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  connection: 'MySQL',
  attributes: {
    id: {
      type: 'integer',
      unique: true,
      primaryKey: true,
    },

    title:{
      type: 'string',
      size: 255,
    },

    description: {
      type: 'text',
      size: 1023,
    },

    rash_link: {
      type: 'string',
    },

    author_id: {
      type: 'integer',
    },

    conference_id: {
      type: 'integer',
    },

    status: {
      type: 'integer',
      size: 1,
    },
  }
}
