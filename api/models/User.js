// User.js
var hat = require('hat')
var md5 = require('js-md5')

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

    sex: {
      type: 'string',
      required: true
    },

    token: {
      type: 'string',
      unique: true
    },

    tempToken: {
	  type: 'string',
	  unique: true
    },

    chair_conferences: {
      collection: 'conference',
      via: 'chairs'
    },

    guest_conferences: {
      collection: 'conference',
      via: 'pc_members'
    },

  	reviewer_conferences: {
  	  collection: 'conference',
  	  via: 'reviewers'
  	},

  	reviewer_papers: {
  	  collection: 'paper',
  	  via: 'reviewers'
  	},

    co_files: {
      collection: 'paper',
      via: 'author'
    },

    papers: {
      collection: 'paper',
      via: 'owner'
    },

    ratings: {
      collection: 'rating',
      via: 'author'
    },

    reviews: {
      collection: 'review',
      via: 'author'
    },

    encryptPassword: function () {
      var ha1 = md5(this.email.toString() + this.password.toString()) // encrypt to digest password
      this.password = ha1
    },

    verifyPassword: function (digest) {
      ha1 = this.password // digest password  = md5(email+password)
      return (digest.toString() == md5(ha1))
    },

    generateToken: function () {
      var token = hat()
      this.token = token
      return token
    },

    generateTempToken: function () {
	  var token = hat()
	  this.tempToken = token
	  return token
    },

    toJSON: function () {
      var obj = this.toObject()
      delete obj.tempToken
      delete obj.password
      delete obj.token
      return obj
    }
  },

  encryptPassword: function (email, password) {
    return md5(email + password) // HA1
  }
}
