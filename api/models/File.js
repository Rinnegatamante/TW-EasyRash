/**
 * Paper.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    id: {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: 'string',
      size: 255
    },

    mime: {
      type: 'string',
      size: 255
    },

    url: {
      type: 'string'
    },

    author: {
      model: 'user'
    }
  }
}
