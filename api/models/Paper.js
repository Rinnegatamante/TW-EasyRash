/**
 * Paper.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
 var hat = require('hat')

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

     r_accepted: {
       type: 'integer',
       size: 1
     },

     r_rejected: {
       type: 'integer',
       size: 1
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
       if (this.token == null || this.token == utoken) {
         return false
       } else {
         return true
       }
     },
     lock: function (utoken) {
       if (this.token == null) {
         this.token = hat()
         return this.token
       }
       return false
     },
     free: function (utoken) {
       if (this.token == utoken) {
         this.token = null
         return true
       }
       return false
     },
     reviewerAccept: function (r_status) { // Incremet r_accept if reviewer accpet otherwise increment r_rejected
       if (r_status == 1) {
         this.r_accepted++
       } else {
         this.r_rejected++
       }
     },
     toJSON: function () {
       var obj = this.toObject()
       obj.url = this.url.replace(sails.config.appPath + '/assets', '')
       delete obj.token
       return obj
     }
   }
 }
