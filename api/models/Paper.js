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
      collection: 'user',
      via: 'co_files'
    },

    owner: {
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

    reviewers: {
      collection: 'user',
      via: 'reviewer_papers'
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
    },
    toJSON: function () {
      var obj = this.toObject()
      obj.url = this.url.replace(sails.config.appPath + '/assets', '')
      return obj
    }
  }
}
