/**
 * Controller.js
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
      autoIncrement: true,
      primaryKey: true,
    },

    status: {
      type: 'integer',
      required: true,
      defaultsTo: 1,
    },

    acronym: {
      type: 'string',
      required: true,
    },

    title: {
      type: 'string',
      required: true,
    },

    chairs: {
      collection: 'user',
      via: 'conferences',
    },

    papers: {
      collection: 'paper',
      via: 'conference_id',
    },
  }
};
