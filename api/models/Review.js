/**
 * Review.js
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
      autoIncrement: true,
    },

    text: {
      type: 'text',
      size: 1023,
      required: true,
    },

    author_id: {
      type: 'integer',
      required: true,
    },

    paper_id: {
      type: 'integer',
      required: true,
    },

    flag: {
      type: 'integer',
      size: 1,
      defaultsTo: 0,
    },
  }
}
