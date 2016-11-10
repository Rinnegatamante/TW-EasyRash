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

    encryptPassword: function () {
      var ha1 = md5(this.email + this.password) // encrypt to digest password
      this.password = ha1
    },
    verifyPassword: function (digest) {
      ha1 = this.password // digest password
      ha2 = 'POST' + 'http://localhost:1337'
      var d = new Date()
      var nonce_pre = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDay(), d.getUTCHours(), d.getUTCMinutes() - 1).toString()
      var nonce = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDay(), d.getUTCHours(), d.getUTCMinutes()).toString()
      console.log(ha1, ha2, nonce)

      console.log(md5(ha1 + nonce + ha2))
      console.log('pre', md5(ha1 + nonce_pre + ha2))
      return (digest == md5(ha1 + nonce + ha2) || digest == md5(ha1 + nonce_pre + ha2))
    },

    generateToken: function () {
      var token = hat()
      this.token = token
      return token
    },

    toJSON: function () {
      var obj = this.toObject()
      delete obj.password
      delete obj.token
      return obj
    }
  },

  encryptPassword: function (email, password) {
    return md5(email + password) // HA1
  }
}
