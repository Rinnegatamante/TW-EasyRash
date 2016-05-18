// User.js
module.exports = {
    connection: 'MySQL',
    attributes: {
        id: {
            type: 'objectid',
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },

        name: {
            type: 'string',
            required: true,
        },

        email: {
            type: 'email',
            unique: true,
            required: true,
        },

        password: {
            type: 'string',
            required: true,
        },

        token: {
            type: 'string',
            unique: true
        },

        conferences: {
          collection: 'conference',
          via: 'chairs',
          dominant: true
        }
    },
};
