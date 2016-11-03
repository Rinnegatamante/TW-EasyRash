// User.js
var hat = require('hat')

module.exports = {
  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },

    name: {
      type: 'string',
      required: true
    },

    email: {
      type: 'email',
      unique: true,
      required: true
    },

    password: {
      type: 'string',
      required: true
    },

    token: {
      type: 'string',
      unique: true
    },

    conferences: {
      collection: 'conference',
      via: 'chairs'
    },

    papers: {
      collection: 'paper',
      via: 'author'
    },

    ratings: {
      collection: 'rating',
      via: 'author'
    },

    reviews: {
      collection: 'review',
      via: 'author'
    },

    generateToken: () => {
      var token = hat()
      this.token = token
      return token
    },

    toJSON: () => {
      this.toObject()
      delete this.password
      delete this.token
      return this
    }
  }
}
