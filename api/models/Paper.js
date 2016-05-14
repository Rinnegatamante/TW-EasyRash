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
            autoIncrement: true,
        },

        title: {
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
            required: true,
        },

        conference_id: {
            type: 'integer',
            required: true,
        },

        status: {
            type: 'integer',
            size: 1,
            defaultsTo: 0,
            required: true,
        },

        token: {
            type: "text",
        }
    },
    isLocked: function(utoken) {
        if (this.token == NULL || this.token == utoken) {
            return false;
        } else {
            return true;
        }
    },
    lock: function(utoken, callback) {
        if (this.token == NULL) {
            this.token == utoken;
            this.save(function(err,s){
              callback(err,s);
            });
            return true;
        } else {
            callback({message: 'Review is alreadt lock'}, undefined);
            return false;
        }
    },
    free: function(utoken, callback) {
        if (this.token == utoken) {
            this.token == NULL;
            this.save(function(err,s){
              callback(err,s);
            });
            return true;
        } else {
            callback({message: 'Invalid token for this Review'}, undefined);
            return false;
        }
    }
}
