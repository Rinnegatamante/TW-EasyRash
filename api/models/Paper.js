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

    description: {
      type: 'text',
      size: 1023
    },

    rash_link: {
      type: 'string'
    },

    status: {
      type: 'integer',
      size: 1,
      defaultsTo: 0,
      required: true
    },

    token: {
      type: 'text'
    },

    author: {
      model: 'user'
    },

    conference: {
      model: 'conference'
    },

    ratings: {
      collection: 'rating',
      via: 'paper'
    },

    reviews: {
      collection: 'review',
      via: 'paper'
    },

    isLocked: function (utoken) {
      if (this.token == NULL || this.token == utoken) {
        return false
      } else {
        return true
      }
    },
    lock: function (utoken) {
      if (this.token == NULL) {
        this.token == utoken
      }
    },
    free: function (utoken, callback) {
      if (this.token == utoken) {
        this.token == NULL
      }
    }
  }
}
